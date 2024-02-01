// Run the migration script independently, ensuring the backend server is shut down beforehand.
// node ./backend/migrations/2024-1-29-uuid.js

require('dotenv').config()
const {GraphDB, UUIDGenerator, Transaction} = require("graphdb-utils");
const {load} = require("../loaders/graphDB");
const crypto = require("crypto");

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
  await load();

  // Get all entities
  const uris = await getAllEntitiesWithId();

  // old uri -> new uri
  const uriMap = new Map();
  for (const uri of uris) {
    const [name, id] = uri.split('_');
    uriMap.set(uri, name + '_' + crypto.randomUUID());
  }
  // console.log(uris)
  await Transaction.beginTransaction();

  try {
    for (const uri of uris) {
      await renameEntity(uri, uriMap);
    }
    const entitiesLeft = await getAllEntitiesWithId();
    if (entitiesLeft.size > 0) {
      console.log(entitiesLeft)
      console.error(`Something wrong happened, not all entities are renamed (${entitiesLeft.size}), rolling back...`)
      await Transaction.rollback();
    } else {
      await Transaction.commit();
    }
  } catch (e) {
    console.error(e);
    await Transaction.rollback();
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

if (!module.parent) {
  migration_uuid().then(() => console.log('UUID Migration done.'));
} else {
  throw new Error(`You should not import this file, this is meant to be run standalone.`);
}

