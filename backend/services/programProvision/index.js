const {SPARQL, sortObjectByKey} = require("../../utils/graphdb/helpers");
const {GraphDB} = require("../../utils/graphdb");

async function getClientNeedOccurrenceByClient(req, res) {
  const instances = {};

  const clientFullURI = req.params.client;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?needOcc ?description ?type where { 
        bind(<${clientFullURI}> as ?client)
        ?needOcc a :NeedOccurrence, owl:NamedIndividual.
        ?needOcc :occurrenceOf ?need.
        ?client :hasNeed ?need.
        # description & name
        optional { ?need cids:hasDescription ?description. }
        optional { ?need :hasType ?type. }
    }`;

  await GraphDB.sendSelectQuery(query, false, ({needOcc, description, type}) => {
    instances[needOcc.id] = type?.value || description?.value || needOcc.id;
  });
  res.json(sortObjectByKey(instances));
}

async function getServiceOccurrenceByService(req, res) {
  const instances = {};

  const programFullURI = req.params.program;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?programOcc ?description where { 
        bind(<${programFullURI}> as ?program)
        ?programOcc a :ServiceOccurrence, owl:NamedIndividual.
        ?programOcc :occurrenceOf ?program.
        # description
        optional { ?programOcc cids:hasDescription ?description. }
    }`;

  await GraphDB.sendSelectQuery(query, false, ({programOcc, description}) => {
    instances[programOcc.id] = description?.value || programOcc.id;
  });
  res.json(sortObjectByKey(instances));
}

async function getNeedSatisfiersByServiceOccurrence(req, res) {
  const instances = {};

  const programOccFullURI = req.params.programOccurrence;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?needSatisfier ?description where { 
        bind(<${programOccFullURI}> as ?programOcc)
        ?needSatisfier a :NeedSatisfier, owl:NamedIndividual.
        ?programOcc :hasNeedSatisfier ?needSatisfier.
        ?programOcc a :ServiceOccurrence.
        # description & name
        optional { ?needSatisfier cids:hasDescription ?description. }
        optional { ?needSatisfier :hasType ?type. }
    }`;

  await GraphDB.sendSelectQuery(query, false, ({needSatisfier, description, type}) => {
    instances[needSatisfier.id] = type?.value || description?.value || needSatisfier.id;
  });
  res.json(sortObjectByKey(instances));
}

async function getNeedSatisfiersByService(req, res) {
  const instances = {};

  const programFullURI = req.params.program;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?needSatisfier ?description where { 
        bind(<${programFullURI}> as ?program)
        ?needSatisfier a :NeedSatisfier, owl:NamedIndividual.
        ?program :hasNeedSatisfier ?needSatisfier.
        ?program a :Service.
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
  getClientNeedOccurrenceByClient,
  getServiceOccurrenceByService,
  getNeedSatisfiersByServiceOccurrence,
  getNeedSatisfiersByService,
}
