const {SPARQL, sortObjectByKey, GraphDB} = require("graphdb-utils");

async function getPartnerOrganizations(req, res) {
  const instances = {};
  const fullURI = SPARQL.ensureFullURI(':Organization') ;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select *
    where {
        ?s a <${fullURI}>, owl:NamedIndividual.
        ?s :hasStatus "Partner".
        OPTIONAL {?s tove_org:hasName ?toveHasName . } # for tove_org:hasName property
        FILTER (isIRI(?s))
    }`;

  await GraphDB.sendSelectQuery(query, false, ({s, toveHasName}) => {
    if (toveHasName?.value) {
      instances[s.id] = toveHasName?.value;
    } else {
      instances[s.id] = SPARQL.ensurePrefixedURI(s.id) || s.id;
    }
  });
  res.json(sortObjectByKey(instances));
}


module.exports = {
  getPartnerOrganizations,
}
