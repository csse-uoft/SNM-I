const {getRepository} = require('../../loaders/graphDB');
const {GetQueryPayload, QueryType, UpdateQueryPayload} = require('graphdb').query;
const {RDFMimeType, QueryContentType} = require('graphdb').http;
const {GraphDBError} = require('./graphDBError');
const {SPARQL} = require('../../loaders/namespaces');

/**
 * Get the hash tag from uri.
 * @param uri
 * @private
 * @returns {*|string}
 */
function getGraphDBAttribute(uri) {
  const lst = uri.split("#")
  return lst[lst.length - 1]
}


const GraphDB = {
  sendSelectQuery: async (query, inference=false, onData) => {
    const repository = await getRepository();

    const payload = new GetQueryPayload()
      .setQuery(query)
      .setQueryType(QueryType.SELECT)
      .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON)
      .setInference(inference);

    try {
      const stream = await repository.query(payload);
      await new Promise((resolve, reject) => {
        stream.on('data', onData);
        stream.on('finish', () => {
          resolve();
        });
        stream.on('error', (err) => {
          reject(err);
        })
      });
    } catch (e) {
      throw new GraphDBError('sendSelectQuery', e);
    }
  },

  sendUpdateQuery: async (query) => {
    const time = Date.now();
    console.log(`------ Update query: ------\n${query}`);
    try {
      const payload = new UpdateQueryPayload()
        .setQuery(query)
        .setContentType(QueryContentType.SPARQL_UPDATE)
        // .setInference(true)
        .setTimeout(5);

      await (await getRepository()).update(payload);
    } catch (e) {
      // Rewrap to a more meaning error
      throw new GraphDBError('sendUpdateQuery', e);
    }
    console.log(`---------- ${Date.now() - time} ms -----------`);
  },

  sendConstructQuery: async (query, onData) => {
    const time = Date.now();
    console.log(`------ Construct query: -------\n${query}`);
    const repository = await getRepository();

    const payload = new GetQueryPayload()
      .setQuery(query)
      .setQueryType(QueryType.CONSTRUCT)
      .setResponseType(RDFMimeType.JSON_LD)
      .setTimeout(5);

    try {
      const stream = await repository.query(payload);
      await new Promise((resolve, reject) => {
        stream.on('data', onData);
        stream.on('finish', () => {
          resolve();
        });
        stream.on('error', (err) => {
          reject(err);
        })
      });
    } catch (e) {
      throw new GraphDBError('sendConstructQuery', e);
    }
    console.log(`---------- ${Date.now() - time} ms -----------`);
  },

  getIdByNamedIndividual: (subject) => {
    return subject.slice(subject.lastIndexOf('_') + 1)
  },

  /**
   *
   * @param type
   * @return {Promise<Object.<string, string>>}
   */
  getAllInstancesWithLabel: async (type) => {
    const query = `
      ${SPARQL.getSPARQLPrefixes()}
      select * where {
        ?s rdf:type :${type} .
        ?s rdfs:label ?label .
      }`;

    const result = {};

    await GraphDB.sendSelectQuery(query, ({s, label}) => {
      result[s.value.match(/#([^#]*)/)[1]] = label.value;
    });

    return result;
  },

  /**
   * @param type
   * @return {Promise<Object.<string, {label: string, comment: string}>>}
   */
  getAllInstancesWithLabelComment: async (type) => {
    const query = `
      ${SPARQL.getSPARQLPrefixes()}
      select * where {
        ?s rdf:type :${type} .
        ?s rdfs:label ?label .
        ?s rdfs:comment ?comment .
      }`;

    const result = {};
    await GraphDB.sendSelectQuery(query, false,({s, label, comment}) => {
      result[s.value.match(/#([^#]*)/)[1]] = {
        label: label.value, comment: comment.value,
      };
    });

    return result;
  },
}

module.exports = {getGraphDBAttribute, GraphDB}
