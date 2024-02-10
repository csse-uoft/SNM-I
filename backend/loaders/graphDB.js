const {RDFMimeType, QueryContentType} = require('graphdb').http;
const {UpdateQueryPayload} = require('graphdb').query;
const {graphdb, mongodb} = require('../config');
const {sleep} = require('../utils');
const {namespaces} = require('./namespaces');
const {initGraphDB, MongoDBIdGenerator, importRepositorySnapshot} = require("graphdb-utils");
let repository;

async function getRepository() {
  while (!repository) {
    await sleep(100);
  }
  return repository;
}


async function cleanup() {
  const sendQuery = async query => {
    try {
      const payload = new UpdateQueryPayload()
        .setQuery(query)
        .setContentType(QueryContentType.SPARQL_UPDATE)
        .setTimeout(5);

      await (await getRepository()).update(payload);
    } catch (e) {
      console.log('Failed to cleanup.', query, e);
    }
  }
  // Remove all named graph
  await sendQuery("DROP NAMED");
}

async function setupConnector(){
  // service, program, characteristicoccurrence, address, organization, volunteer

  let service_query = `
PREFIX :<http://www.ontotext.com/connectors/lucene#>
PREFIX inst:<http://www.ontotext.com/connectors/lucene/instance#>
INSERT DATA {
\tinst:service_connector :createConnector '''
{
  "fields": [
    {
      "fieldName": "Name",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/organization#hasName"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "Eligibility",
      "propertyChain": [
        "http://snmi#hasEligibilityCondition"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    }
  ],
  "languages": [],
  "types": [
    "http://snmi#Service"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "skipInitialIndexing": false,
  "boostProperties": [],
  "stripMarkup": false
}
''' .
}  
`
  let program_query = `
PREFIX :<http://www.ontotext.com/connectors/lucene#>
PREFIX inst:<http://www.ontotext.com/connectors/lucene/instance#>
INSERT DATA {
\tinst:program_connector :createConnector '''
{
  "fields": [
    {
      "fieldName": "Name",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/organization#hasName"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    }
  ],
  "languages": [],
  "types": [
    "http://snmi#Program"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "skipInitialIndexing": false,
  "boostProperties": [],
  "stripMarkup": false
}
''' .
}
  `
  let characteristicoccurrence_query = `
PREFIX :<http://www.ontotext.com/connectors/lucene#>
PREFIX inst:<http://www.ontotext.com/connectors/lucene/instance#>
INSERT DATA {
\tinst:characteristicoccurrence_connector :createConnector '''
{
  "fields": [
    {
      "fieldName": "string",
      "propertyChain": [
        "http://snmi#hasStringValue"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "object",
      "propertyChain": [
        "http://snmi#hasObjectValue"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "date",
      "propertyChain": [
        "http://snmi#hasDateValue"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "number",
      "propertyChain": [
        "http://snmi#hasNumberValue"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "boolean",
      "propertyChain": [
        "http://snmi#hasBooleanValue"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "multipleobject",
      "propertyChain": [
        "http://snmi#hasMultipleObjectValue"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    }
  ],
  "languages": [],
  "types": [
    "http://snmi#CharacteristicOccurrence"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "skipInitialIndexing": false,
  "boostProperties": [],
  "stripMarkup": false
}
''' .
}
  `
  let address_query = `
PREFIX :<http://www.ontotext.com/connectors/lucene#>
PREFIX inst:<http://www.ontotext.com/connectors/lucene/instance#>
INSERT DATA {
\tinst:address_connector :createConnector '''
{
  "fields": [
    {
      "fieldName": "city",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/icontact#hasCityS"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "citysection",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/icontact#hasCitySection"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "postalcode",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/icontact#hasPostalCode"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "state",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/icontact#hasState"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "street",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/icontact#hasStreet"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "streetdirection",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/icontact#hasStreetDirection"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "streetnumber",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/icontact#hasStreetNumber"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "streettype",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/icontact#hasStreetType"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "unitnumber",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/icontact#hasUnitNumber"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "type",
      "propertyChain": [
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    }
  ],
  "languages": [],
  "types": [
    "http://ontology.eil.utoronto.ca/tove/icontact#Address"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "skipInitialIndexing": false,
  "boostProperties": [],
  "stripMarkup": false
}
''' .
}
  `
  let organization_query = `
PREFIX :<http://www.ontotext.com/connectors/lucene#>
PREFIX inst:<http://www.ontotext.com/connectors/lucene/instance#>
INSERT DATA {
\tinst:organization_connector :createConnector '''
{
  "fields": [
    {
      "fieldName": "name",
      "propertyChain": [
        "http://ontology.eil.utoronto.ca/tove/organization#hasName"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    }
  ],
  "languages": [],
  "types": [
    "http://snmi#Organization"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "skipInitialIndexing": false,
  "boostProperties": [],
  "stripMarkup": false
}
''' .
}
  `
  let volunteer_query = `
PREFIX :<http://www.ontotext.com/connectors/lucene#>
PREFIX inst:<http://www.ontotext.com/connectors/lucene/instance#>
INSERT DATA {
\tinst:volunteer_connector :createConnector '''
{
  "fields": [
    {
      "fieldName": "firstname",
      "propertyChain": [
        "http://xmlns.com/foaf/0.1/givenName"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    },
    {
      "fieldName": "lastname",
      "propertyChain": [
        "http://xmlns.com/foaf/0.1/familyName"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "facet": true
    }
  ],
  "languages": [],
  "types": [
    "http://snmi#Volunteer"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "skipInitialIndexing": false,
  "boostProperties": [],
  "stripMarkup": false
}
''' .
}
  `

  let query_list = [service_query, program_query, characteristicoccurrence_query, address_query, organization_query, volunteer_query]

  let url;
  for (let query of query_list){
    url = `${graphdb.addr}/repositories/snmi/statements?update=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
        },
    });
  }
  console.log("All connectors are loaded")
}



async function load() {
  // ID Generator for creating new instances
  const idGenerator = new MongoDBIdGenerator(mongodb.addr);

  const result = await initGraphDB({
    idGenerator,
    // GraphDB Server Address
    address: graphdb.addr,
    // Remove the username and password fields if the GraphDB server does not require authentication
    username: graphdb.username,
    password: graphdb.password,
    namespaces,
    // The repository name, a new repository will be created if it does not exist.
    repositoryName: process.env.test ? "snmiTest" : "snmi",
  });

  repository = result.repository;

  await cleanup();
  await importRepositorySnapshot('https://github.com/csse-uoft/compass-ontology/releases/download/latest/compass-ontology+dependencies.brf');

  // Load all the connectors for lucene
  await setupConnector()
}


module.exports = {getRepository, load};
