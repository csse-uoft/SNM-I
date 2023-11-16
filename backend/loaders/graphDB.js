const {RDFMimeType, QueryContentType} = require('graphdb').http;
const {UpdateQueryPayload} = require('graphdb').query;
const {graphdb, mongodb} = require('../config');
const {sleep} = require('../utils');
const {namespaces} = require('./namespaces');
const {initGraphDB, MongoDBIdGenerator, importRepositorySnapshot} = require("graphdb-utils");
const fs = require("fs");
const {EOL} = require("os");

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
  // This is a function that loads every lucene connector
  // The file of connector_setup_queries contains the name of the query on odd line, and
  // query itself on the even line (Consider index starts from 1 not 0)
  const fileContent = fs.readFileSync('loaders/connector_setup_queries', 'utf8')
  const queries = fileContent.split(EOL)
  // read the query not the name of the query
  for (let i = 1; i < queries.length; i+=2) {
    await fetch(queries[i], {
      method: 'POST',
      headers: {
        ContentType: 'application/json'
      }
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
