const {SPARQL, sortObjectByKey, GraphDB} = require("graphdb-utils");

async function getProgramOccurrenceByProgram(req, res) {
  const instances = {};

  const programFullURI = req.params.program;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?programOcc ?description where { 
        bind(<${programFullURI}> as ?program)
        ?programOcc a :ProgramOccurrence, owl:NamedIndividual.
        ?programOcc :occurrenceOf ?program.
        # description
        optional { ?programOcc cids:hasDescription ?description. }
    }`;

  await GraphDB.sendSelectQuery(query, false, ({programOcc, description}) => {
    instances[programOcc.id] = description?.value || programOcc.id;
  });
  res.json(sortObjectByKey(instances));
}

async function getNeedSatisfiersByProgramOccurrence(req, res) {
  const instances = {};

  const programOccFullURI = req.params.programOccurrence;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?needSatisfier ?description where { 
        bind(<${programOccFullURI}> as ?programOcc)
        ?needSatisfier a :NeedSatisfier, owl:NamedIndividual.
        ?programOcc :hasNeedSatisfier ?needSatisfier.
        ?programOcc a :ProgramOccurrence.
        # description & name
        optional { ?needSatisfier cids:hasDescription ?description. }
        optional { ?needSatisfier :hasType ?type. }
    }`;

  await GraphDB.sendSelectQuery(query, false, ({needSatisfier, description, type}) => {
    instances[needSatisfier.id] = type?.value || description?.value || needSatisfier.id;
  });
  res.json(sortObjectByKey(instances));
}

async function getNeedSatisfiersByProgram(req, res) {
  const instances = {};

  const programFullURI = req.params.program;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?needSatisfier ?description where { 
        bind(<${programFullURI}> as ?program)
        ?needSatisfier a :NeedSatisfier, owl:NamedIndividual.
        ?program :hasNeedSatisfier ?needSatisfier.
        ?program a :Program.
        # description & name
        optional { ?needSatisfier cids:hasDescription ?description. }
        optional { ?needSatisfier :hasType ?type. }
    }`;

  await GraphDB.sendSelectQuery(query, false, ({needSatisfier, description, type}) => {
    instances[needSatisfier.id] = type?.value || description?.value || needSatisfier.id;
  });
  res.json(sortObjectByKey(instances));
}


module.exports = {
  getProgramOccurrenceByProgram,
  getNeedSatisfiersByProgramOccurrence,
  getNeedSatisfiersByProgram,
}
