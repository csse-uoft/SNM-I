const {RDFMimeType, QueryContentType} = require('graphdb').http;
const {UpdateQueryPayload} = require('graphdb').query;
const {graphdb, mongodb} = require('../config');
const {sleep} = require('../utils');
const {namespaces} = require('./namespaces');
const {initGraphDB, UUIDGenerator, importRepositorySnapshot} = require("graphdb-utils");

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


async function load() {
  // ID Generator for creating new instances
  const idGenerator = new UUIDGenerator();

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

}


module.exports = {getRepository, load};
