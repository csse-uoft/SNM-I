// Run the migration script independently, ensuring the backend server is shut down beforehand.
// node ./backend/migrations/2024-1-29-uuid.js

require('dotenv').config()
const {GraphDB, UUIDGenerator, Transaction, SPARQL} = require("graphdb-utils");
const {db: mongoDB} = require("../loaders/mongoDB");
const {MDBDynamicFormModel} = require("../models/dynamicForm");
const {load} = require("../loaders/graphDB");
const crypto = require("crypto");
const {MDBUsageModel} = require("../models/usage");

async function getAllEntitiesWithId() {
  const uris = new Set();
  await GraphDB.sendSelectQuery(`
    PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
    SELECT DISTINCT * FROM sesame:nil WHERE { 
    
        SELECT ?s WHERE {
            {?s ?p ?o .}
            UNION
            {?s2 ?p2 ?s}
            FILTER (ISIRI(?s))
            FILTER (regex(str(?s), "_\\\\d+$")) # Ends with _ + number
        }
    
    } order by ?s
    `, false, ({s}) => {
    uris.add(s.value);
  });
  return uris;
}

async function migration_uuid() {

  // Get all entities
  const uris = await getAllEntitiesWithId();

  // old uri -> new uri
  const uriMap = new Map();
  for (const uri of uris) {
    const [name, id] = uri.split('_');
    uriMap.set(uri, name + '_' + crypto.randomUUID());
  }

  for (const uri of uris) {
    await renameEntity(uri, uriMap);
  }
  const entitiesLeft = await getAllEntitiesWithId();
  if (entitiesLeft.size > 0) {
    console.log(entitiesLeft)
    throw new Error(`Something wrong happened, not all entities are renamed (${entitiesLeft.size})`);
  } else {
    return uriMap;
  }

}

// Get all relative triples and rename it.
async function renameEntity(uri, uriMap) {
  // console.log('Renaming', uri);

  // Get all relative triples that uses `uri`
  const triples = [];
  await GraphDB.sendConstructQuery(`
    PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
    PREFIX : <http://snmi#>
    
    CONSTRUCT {
        <${uri}> ?p ?o.
        ?s2 ?p2 <${uri}>
    } FROM sesame:nil WHERE { 
        <${uri}> ?p ?o .
        Optional {
            ?s2 ?p2 <${uri}>
        }
    }`, ({subject, predicate, object}) => {
    triples.push([subject, predicate, object]);
  });
  //
  // console.log(triples)

  // Rename the triples
  const deleteTriples = [];
  const inserTriples = [];
  for (const [s, p, o] of triples) {
    let shouldUpdate = false;
    const insertTriple = [s, p, o];
    if (uriMap.has(s.value)) {
      insertTriple[0] = {value: uriMap.get(s.value)};
      shouldUpdate = true;
    }
    if (o.termType === 'NamedNode' && uriMap.has(o.value)) {
      insertTriple[2] = {value: uriMap.get(o.value)};
      shouldUpdate = true;
    }
    if (shouldUpdate) {
      let objectPart;
      if (o.termType === "Literal") {
        const dataType = o.datatype.value;
        objectPart = `${JSON.stringify(o.value)}^^<${dataType}>`
      } else {
        // IRI
        objectPart = `<${o.value}>`;
      }

      // Delete
      deleteTriples.push(`<${s.value}> <${p.value}> ${objectPart}.`);

      // Insert
      inserTriples.push(`<${insertTriple[0].value}> <${insertTriple[1].value}> ${o.termType === 'Literal' ? objectPart : `<${insertTriple[2].value}>`}.`);
    }
  }

  if (deleteTriples.length === 0 && inserTriples.length === 0) return;

  const query = `DELETE WHERE {\n\t${deleteTriples.join('\n\t')}\n};\nINSERT DATA {\n\t${inserTriples.join('\n\t')}\n}`;
  // console.log(query)
  await GraphDB.sendUpdateQuery(query);
}

async function updateEligibility(uriMap) {
  const triples = [];
  await GraphDB.sendSelectQuery(`
    PREFIX : <http://snmi#>
    select * where { 
      ?s :hasFormulaJSON ?o .
      ?s a :Eligibility.
      ?s :hasFormula ?formula.
    }`, false, ({s, o, formula}) => {
    triples.push([s.value, o.value, formula.value]);
  });

  const deletions = [];
  const insertions = [];

  for (let [s, o, formula] of triples) {
    const replacer =  (match) => {
      const uri = SPARQL.ensureFullURI(`:${match}`);
      if (uriMap.has(uri)) {
        const newURI = uriMap.get(uri);
        return 'characteristic_' + newURI.split('_').slice(-1)[0];
      }
      return match;
    };

    const newO = o.replace(/characteristic_\d+/, replacer);
    const newFormula = formula.replace(/characteristic_\d+/, replacer);
    // console.log('eligibility ', o, '->', newO)

    if (o !== newO) {
      deletions.push(`<${s}> :hasFormulaJSON ${JSON.stringify(o)}.`);
      deletions.push(`<${s}> :hasFormula ${JSON.stringify(formula)}.`);

      insertions.push(`<${s}> :hasFormulaJSON ${JSON.stringify(newO)}.`)
      insertions.push(`<${s}> :hasFormula ${JSON.stringify(newFormula)}.`)
    }
  }
  if (deletions && insertions) {
    const query = `PREFIX : <http://snmi#>\nDELETE WHERE {\n\t${deletions.join('\n\t')}\n};\nINSERT DATA {\n\t${insertions.join('\n\t')}\n}`;
    await GraphDB.sendUpdateQuery(query);
  }
}

function updateInstance(uriMap, field) {
  if (!field._uri) return;

  // Update _id, _uri, id, iri, based on _uri
  const uri = SPARQL.ensureFullURI(field._uri);
  if (uri && uriMap.has(uri)) {
    field._uri = uriMap.get(uri);
    const id = field._uri.split('_').slice(-1)[0];
    if (field._id) field._id = id;
    if (field.id) field.id = id;
    if (field.iri) field.iri = uri;
  }
}

async function migrateFormStructure(uriMap) {
  const forms = await MDBDynamicFormModel.find({});
  for (const form of forms) {
    const oldCreatedBy = SPARQL.ensureFullURI(form.createdBy);
    if (uriMap.has(oldCreatedBy)) {
      form.createdBy = SPARQL.ensurePrefixedURI(uriMap.get(oldCreatedBy));
    }
    for (const step of form.formStructure) {
      for (const field of step.fields) {
        updateInstance(uriMap, field);

        const implementation = field.implementation;
        if (implementation) {
          updateInstance(uriMap, implementation);
          updateInstance(uriMap, implementation.fieldType);
          if (implementation.options) {
            for (const option of implementation.options) {
              updateInstance(uriMap, option)
            }
          }
        } else if (field.type === 'question') {
          const uri = `:question_${field.id}`;
          if (uriMap.has(SPARQL.ensureFullURI(uri))) {
            field.id = uriMap.get(SPARQL.ensureFullURI(uri)).split('_').slice(-1)[0];
          }
        } else {
          throw Error("Should not reach here.")
        }


      }
    }
    form.markModified('formStructure');
    await form.save();
    // console.log(JSON.stringify(form.toJSON(), null, 2));
  }

}

async function migrateUsages(uriMap) {
  const usages = await MDBUsageModel.find({});
  for (const usage of usages) {
    const {optionKeys, option, genericType} = usage;
    const newOptionKeys = [];
    for (const id of optionKeys) {
      const uri = SPARQL.ensureFullURI(`:${option}_${id}`);
      if (uriMap.has(uri)) {
        const newUri = uriMap.get(uri);
        newOptionKeys.push(newUri.split('_').slice(-1)[0]);
      } else {
        newOptionKeys.push(id);
      }
    }
    usage.optionKeys = newOptionKeys;
    await usage.save();
  }
}

async function main() {
  await load();

  await Transaction.beginTransaction();

  const session = await mongoDB.startSession();
  session.startTransaction();

  let uriMap;
  try {
    // GraphDB
    uriMap = await migration_uuid();
    await updateEligibility(uriMap);

    // MongoDB
    await migrateFormStructure(uriMap);
    await migrateUsages(uriMap);

    // commit
    await Transaction.commit();
    session.commitTransaction();
    session.endSession();

    console.log('UUID Migration done.')
    process.exit(0);

  } catch (e) {
    console.error(e);
    console.log('UUID Migration failed. Rolling back...')
    await Transaction.rollback();
    process.exit(1);
  }
}
if (!module.parent) {
  main().catch(console.error);

} else {
  throw new Error(`You should not import this file, this is meant to be run standalone.`);
}

