const {GraphDBServerClient, ServerClientConfig} = require('graphdb').server;
const {RepositoryClientConfig, RDFRepositoryClient, RepositoryConfig, RepositoryType} = require('graphdb').repository;
const {UpdateQueryPayload} = require('graphdb').query;
const {SparqlJsonResultParser, JsonLDParser} = require('graphdb').parser;
const {RDFMimeType, QueryContentType} = require('graphdb').http;
const {graphdb} = require('../config');
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const {sleep} = require('../utils');
const {namespaces} = require('./namespaces');

let dbClient, repository;

async function getRepository() {
  while (!repository) {
    await sleep(100);
  }
  return repository;
}

async function createRepository(dbClient, dbName) {
  // Create repository configuration
  const config = new RepositoryConfig(dbName, '', new Map(), '', 'SNM-I', RepositoryType.FREE);
  // Use the configuration to create new repository
  await dbClient.createRepository(config);
}

async function loadInitialData(file, overwrite = !!process.env.test) {
  const contentType = RDFMimeType.TURTLE;
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, stream) => {
      repository[overwrite ? 'overwrite' : 'upload'](stream, contentType, null, null)
        .then(() => resolve())
        .catch(reason => reject(reason));
    });
  });
}

async function importRepositorySnapshot(url) {
  const response = await fetch(url);

  return new Promise((resolve, reject) => {
    repository.upload(response.body, RDFMimeType.BINARY_RDF, null, null)
      .then(resolve)
      .catch(reason => reject(reason));
  });
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

async function load() {
  const DBName = process.env.test ? "snmiTest" : "snmi"

  const serverConfig = new ServerClientConfig(graphdb.addr, 0, {
    'Accept': RDFMimeType.SPARQL_RESULTS_JSON
  });

  if (graphdb.username) {
    serverConfig.useGdbTokenAuthentication(graphdb.username, graphdb.password);
  }

  dbClient = new GraphDBServerClient(serverConfig);
  const ids = await dbClient.getRepositoryIDs();
  if (!ids.includes(DBName)) {
    await createRepository(dbClient, DBName);
    console.log(`Repository \`${DBName}\` created.`)
  }
  const readTimeout = 30000;
  const writeTimeout = 30000;

  const config = new RepositoryClientConfig(graphdb.addr)
    .setEndpoints([`${graphdb.addr}/repositories/${DBName}`])
    .setHeaders({
      'Accept': RDFMimeType.SPARQL_RESULTS_JSON
    })
    .setReadTimeout(readTimeout)
    .setWriteTimeout(writeTimeout);

  if (graphdb.username) {
    config.useGdbTokenAuthentication(graphdb.username, graphdb.password);
  }

  repository = new RDFRepositoryClient(config);

  // using https://github.com/rubensworks/sparqljson-parse.js
  repository.registerParser(new SparqlJsonResultParser());
  repository.registerParser(new JsonLDParser());

  console.log(`GraphDB ${DBName} connected.`);

  await cleanup();

  // await loadInitialData(__dirname + '/../ontologies/icontact.ttl');
  // await loadInitialData(__dirname + '/../ontologies/creative_mixed-use_ontology.ttl');
  await importRepositorySnapshot('https://github.com/csse-uoft/compass-ontology/releases/download/latest/repository-export.brf');

  // Namespaces, this could be used within the query without specifying it in the prefixes
  const tasks = []
  for (const [prefix, uri] of Object.entries(namespaces)) {
    if (prefix === '') continue;
    // console.log(prefix, uri)
    tasks.push(repository.saveNamespace(prefix, uri));
  }
  await Promise.all(tasks)

  console.log('GraphDB loaded.');
}

module.exports = {getRepository, load};
