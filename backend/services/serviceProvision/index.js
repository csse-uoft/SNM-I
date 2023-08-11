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

async function getClientOutcomeOccurrenceByClient(req, res) {
  const instances = {};

  const clientFullURI = req.params.client;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?outcomeOcc ?description ?type where {
        bind(<${clientFullURI}> as ?client)
        ?outcomeOcc a :NeedOccurrence, owl:NamedIndividual.
        ?outcomeOcc :occurrenceOf ?outcome.
        ?client :hasOutcome ?outcome.
        # description & name
        optional { ?outcome cids:hasDescription ?description. }
        optional { ?outcome :hasType ?type. }
    }`;

  await GraphDB.sendSelectQuery(query, false, ({outcomeOcc, description, type}) => {
    instances[outcomeOcc.id] = type?.value || description?.value || outcomeOcc.id;
  });
  res.json(sortObjectByKey(instances));
}

async function getServiceOccurrenceByService(req, res) {
  const instances = {};

  const serviceFullURI = req.params.service;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?serviceOcc ?description where { 
        bind(<${serviceFullURI}> as ?service)
        ?serviceOcc a :ServiceOccurrence, owl:NamedIndividual.
        ?serviceOcc :occurrenceOf ?service.
        # description
        optional { ?serviceOcc cids:hasDescription ?description. }
    }`;

  await GraphDB.sendSelectQuery(query, false, ({serviceOcc, description}) => {
    instances[serviceOcc.id] = description?.value || serviceOcc.id;
  });
  res.json(sortObjectByKey(instances));
}

async function getNeedSatisfiersByServiceOccurrence(req, res) {
  const instances = {};

  const serviceOccFullURI = req.params.serviceOccurrence;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?needSatisfier ?description where { 
        bind(<${serviceOccFullURI}> as ?serviceOcc)
        ?needSatisfier a :NeedSatisfier, owl:NamedIndividual.
        ?serviceOcc :hasNeedSatisfier ?needSatisfier.
        ?serviceOcc a :ServiceOccurrence.
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

  const serviceFullURI = req.params.service;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?needSatisfier ?description where { 
        bind(<${serviceFullURI}> as ?service)
        ?needSatisfier a :NeedSatisfier, owl:NamedIndividual.
        ?service :hasNeedSatisfier ?needSatisfier.
        ?service a :Service.
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
  getClientOutcomeOccurrenceByClient,
  getServiceOccurrenceByService,
  getNeedSatisfiersByServiceOccurrence,
  getNeedSatisfiersByService,
}
