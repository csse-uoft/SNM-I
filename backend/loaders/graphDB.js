const {ServerClient, ServerClientConfig} = require('graphdb').server;
const {RepositoryClientConfig, RDFRepositoryClient} = require('graphdb').repository;
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

async function createRepository() {
  const form = new FormData();
  if (process.env.test)
    form.append('config', fs.createReadStream(__dirname + '/configTest.ttl'));
  else
    form.append('config', fs.createReadStream(__dirname + '/config.ttl'));
  form.append('location', '');
  const res = await fetch(graphdb.addr + '/rest/repositories', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });
  if (res.status === 500) {
    throw Error('Fails to create repository: ' + (await res.json()).message);
  }
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

async function cleanup(typesToClean) {
  const generateQuery = type => `
    PREFIX : <http://snmi#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    delete where { 
      ?s rdf:type :${type};
         rdfs:label ?o.
    }`;

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
  // remove existing categories
  await Promise.all(
    typesToClean.map(type => sendQuery(generateQuery(type)))
  );
}

async function load() {
  const DBName = process.env.test ? "snmiTest" : "snmi"

  const serverConfig = new ServerClientConfig(graphdb.addr, 0, {
    'Accept': RDFMimeType.SPARQL_RESULTS_JSON
  });
  dbClient = new ServerClient(serverConfig);
  const ids = await dbClient.getRepositoryIDs();
  if (!ids.includes(DBName)) {
    await createRepository();
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
  repository = new RDFRepositoryClient(config);

  // using https://github.com/rubensworks/sparqljson-parse.js
  repository.registerParser(new SparqlJsonResultParser());
  repository.registerParser(new JsonLDParser());

  console.log(`GraphDB ${DBName} connected.`);

  await cleanup(['project_type', 'partnership_role', 'organization_type', 'project_stage']);

  // await loadInitialData(__dirname + '/../ontologies/icontact.ttl');
  await loadInitialData(__dirname + '/../ontologies/creative_mixed-use_ontology.ttl');

  // Namespaces, this could be used within the query without specifying it in the prefixes
  for (const [prefix, uri] of Object.entries(namespaces)) {
    if (prefix === '') continue;
    // console.log(prefix, uri)
    await repository.saveNamespace(prefix, uri);
  }

  console.log('GraphDB loaded.');
}

module.exports = {getRepository, load};
