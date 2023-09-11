const {SPARQL, GraphDB} = require("graphdb-utils");

/**
 * Return all connected nodes by :kindOf.
 * @param {string} startNodeURI
 * @param {string} rdfTypeURI
 * @param {string} labelPredicateURI
 * @returns {Promise<{[key:string]: {kindOf: string[], label: string}}>}
 */
async function getConnectedKindOfs(startNodeURI, rdfTypeURI, labelPredicateURI) {
  if (startNodeURI) startNodeURI = SPARQL.ensureFullURI(startNodeURI);
  rdfTypeURI = SPARQL.ensureFullURI(rdfTypeURI);
  labelPredicateURI = SPARQL.ensurePrefixedURI(labelPredicateURI);
  const query = `
    PREFIX : <http://snmi#>
    CONSTRUCT {
        ?s ${labelPredicateURI} ?type.
        ?s :kindOf ?k.
        ?s2 ${labelPredicateURI} ?type2.
        ?s2 :kindOf ?k2.
        ?s3 ${labelPredicateURI} ?type3.
        ?s3 :kindOf ?k3.
        ?s4 ${labelPredicateURI} ?type4.
        ?s4 :kindOf ?k4.
        ?s5 ${labelPredicateURI} ?type5.
        ?s5 :kindOf ?k5.
    } WHERE {
        ?s a <${rdfTypeURI}>.
        ?s ${labelPredicateURI} ?type.
        OPTIONAL {?s :kindOf ?k.}
        ${startNodeURI ? `
        {
            ?s :kindOf* <${startNodeURI}>
            OPTIONAL {
              ?s :kindOf* ?s4.
              ?s4 ${labelPredicateURI} ?type4.
              OPTIONAL {?s4 :kindOf ?k4.}
              OPTIONAL {
                ?s5 :kindOf* ?s4.
                ?s5 ${labelPredicateURI} ?type5.
                OPTIONAL {?s5 :kindOf ?k5.}
            }
        }
        } UNION {
            bind(<${startNodeURI}> as ?s)
            ?s :kindOf* ?s2.
    
            ?s2 ${labelPredicateURI} ?type2.
            OPTIONAL {
              ?s2 :kindOf ?k2.
              ?s3 :kindOf* ?k2.
              ?s3 ${labelPredicateURI} ?type3.
              OPTIONAL {?s3 :kindOf ?k3.}
            }
        }` : ''}}`;
  const result = {};
  await GraphDB.sendConstructQuery(query, ({subject, predicate, object}) => {
    if (!result[subject.value]) {
      result[subject.value] = {kindOf: []};
    }
    if (predicate.value === 'http://snmi#kindOf') {
      result[subject.value].kindOf.push(object.value);
    } else if (predicate.value === SPARQL.ensureFullURI(labelPredicateURI)) {
      result[subject.value].label = object.value;
    }
  });
  return result;
}

module.exports = {
  getConnectedKindOfs,
}