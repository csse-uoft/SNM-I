const {SPARQL, GraphDB} = require("graphdb-utils");


/**
 * Return the shortest distance between the 'sourceURI' and the 'sourceURI''s parents.
 * @param {string[] | Set<string>} sourceURIs
 * @param {string} rdfType
 * @returns {Promise<{src: string, dst: string, distance: number}[]>}
 */
async function getKindOfParentDistances(sourceURIs, rdfType) {
  rdfType = SPARQL.ensurePrefixedURI(rdfType);

  const src = [];
  for (const uri of sourceURIs) {
    src.push(`<${SPARQL.ensureFullURI(uri)}>`)
  }

  const query = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX : <http://snmi#>
    PREFIX cids: <http://ontology.eil.utoronto.ca/cids/cids#>
    PREFIX path: <http://www.ontotext.com/path#>
    select * where {
        VALUES ?src {${src.join(' ')}}
        ?src a ${rdfType}.
        ?src :kindOf+ ?dst.
    
        SERVICE <http://www.ontotext.com/path#search> {
          <urn:path> path:findPath path:distance ;
                     path:sourceNode ?src ;
                     path:destinationNode ?dst ;
                     path:distanceBinding ?distance.
       }
    }`;
  const result = [];
  await GraphDB.sendSelectQuery(query, false, ({src, dst, distance}) => {
    result.push({
      src: src.value,
      dst: dst.value,
      distance: Number(distance.value)
    });
  })
  return result;
}


/**
 * Get (Need -> Characteristic)
 * @param {string[] | Set<string>} needURIs
 * @returns {Promise<{need: string, characteristic: string}[]>}
 */
async function getNeeds2Characteristics(needURIs) {
  const needs = [];
  for (const uri of needURIs) {
    needs.push(`<${SPARQL.ensureFullURI(uri)}>`)
  }

  const query = `
    PREFIX : <http://snmi#>
    select ?need ?char where { 
        VALUES ?need {${needs.join(' ')}}
        ?need a :Need ;
              :forCharacteristic ?char.
    }`;

  const result = [];
  await GraphDB.sendSelectQuery(query, false, ({need, char}) => {
    result.push({
      need: need.value,
      characteristic: char.value,
    });
  })
  return result;
}


/**
 * Get (Characteristic -> Need Satisfier)
 * @param {string[] | Set<string>} characteristicURIs
 * @returns {Promise<{characteristic: string, needSatisfier: string}[]>}
 */
async function getCharacteristics2NeedSatisfiers(characteristicURIs) {
  const characteristics = [];
  for (const uri of characteristicURIs) {
    characteristics.push(`<${SPARQL.ensureFullURI(uri)}>`)
  }

  const query = `
    PREFIX : <http://snmi#>
    select ?needSatisfier ?characteristic where { 
        VALUES ?characteristic {${characteristics.join(' ')}}
        ?needSatisfier a :NeedSatisfier;
                       :forCharacteristic ?characteristic.
        # Make sure need satisfier has program or service
        VALUES ?type {:Program :Service}
        ?programOrService a ?type ;
                      :hasNeedSatisfier ?needSatisfier.
    }`;

  const result = [];
  await GraphDB.sendSelectQuery(query, false, ({needSatisfier, characteristic}) => {
    result.push({
      characteristic: characteristic.value,
      needSatisfier: needSatisfier.value,
    });
  })
  return result;
}


/**
 * Get (Need -> Need Satisfier)
 * @param {string[] | Set<string>} needURIs
 * @returns {Promise<{need: string, needSatisfier: string}[]>}
 */
async function getNeeds2NeedSatisfiers(needURIs) {
  const needs = [];
  for (const uri of needURIs) {
    needs.push(`<${SPARQL.ensureFullURI(uri)}>`)
  }

  const query = `
    PREFIX : <http://snmi#>
    select ?need ?needSatisfier where { 
        VALUES ?need {${needs.join(' ')}}
        ?need a :Need ;
              :hasNeedsatisfier ?needSatisfier.
        # Make sure need satisfier has program or service
        VALUES ?type {:Program :Service}
        ?programOrService a ?type ;
                          :hasNeedSatisfier ?needSatisfier.
    }`;

  const result = [];
  await GraphDB.sendSelectQuery(query, false, ({needSatisfier, need}) => {
    result.push({
      need: need.value,
      needSatisfier: needSatisfier.value,
    });
  })
  return result;
}


/**
 * Get (Need -> Programs)
 * @param {string[] | Set<string>} needURIs
 * @returns {Promise<{programs: {needSatisfier: string, program: string}[], services: {needSatisfier: string, service: string}[]}>}
 */
async function getNeedSatisfier2ProgramsOrServices(uris) {
  const needSatisfiers = [];
  for (const uri of uris) {
    needSatisfiers.push(`<${SPARQL.ensureFullURI(uri)}>`)
  }

  const query = `
    PREFIX : <http://snmi#>
    select ?needSatisfier ?programOrService ?type ?name where { 
        VALUES ?needSatisfier {${needSatisfiers.join(' ')}}
        VALUES ?type {:Program :Service}
        ?programOrService a ?type ;
                          <http://ontology.eil.utoronto.ca/tove/organization#hasName> ?name ;
                          :hasNeedSatisfier ?needSatisfier.
    }`;

  const programs = [];
  const services = []
  await GraphDB.sendSelectQuery(query, false, ({needSatisfier, programOrService, type, name}) => {
    if (type.value === 'http://snmi#Program') {
      programs.push({
        needSatisfier: needSatisfier.value,
        program: programOrService.value,
        name: name.value
      });
    } else {
      services.push({
        needSatisfier: needSatisfier.value,
        service: programOrService.value,
        name: name.value
      });
    }
  })
  return {programs, services};
}

module.exports = {
  getKindOfParentDistances,
  getNeeds2Characteristics,
  getCharacteristics2NeedSatisfiers,
  getNeeds2NeedSatisfiers,
  getNeedSatisfier2ProgramsOrServices,
}
