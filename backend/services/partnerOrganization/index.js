const {SPARQL, sortObjectByKey, GraphDB} = require("graphdb-utils");

async function getPartnerOrganizations(req, res) {
  const instances = {};
  const fullURI = SPARQL.ensureFullURI(':Organization') ;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select ?s
    where {
        ?s a <${fullURI}>, owl:NamedIndividual.
        ?s :isPartner true.
        FILTER (isIRI(?s))
    }`;

  await GraphDB.sendSelectQuery(query, false, ({s}) => {
    instances[s.id] = SPARQL.ensurePrefixedURI(s.id) || s.id;
  });
  res.json(sortObjectByKey(instances));
}


module.exports = {
  getPartnerOrganizations,
}
