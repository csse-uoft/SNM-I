const {SPARQL, sortObjectByKey, GraphDB} = require("graphdb-utils");
const { PredefinedInternalTypes, PredefinedCharacteristics } = require("../characteristics");

async function getPartnerOrganizationsHelper() {
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

  return sortObjectByKey(instances);
}

async function getPartnerOrganizations(req, res) {
  res.json(await getPartnerOrganizationsHelper());
}

const getGenericPartners = async function (data, type) {
  const partners = [];
  const shareability = data.fields?.['characteristic_' + PredefinedCharacteristics['Shareability']._id] || data.shareability;
  if (shareability === 'Shareable with all organizations') {
    const partnerOrganizations = await getPartnerOrganizationsHelper();
    for (const partner in partnerOrganizations) {
      partners.push(partner.split('_')[1]);
    }
  } else if (shareability === 'Shareable with partner organizations') {
    const partnerURIs = data.fields?.['internalType_' + PredefinedInternalTypes[`partnerOrganizationFor${type}`]._id] || data.partnerOrganizations || [];

    for (const partner of partnerURIs) {
      partners.push(partner.split('_')[1].replace(/^\W+|\W+$/, ''));
    }
  }

  return partners;
}

module.exports = {
  getPartnerOrganizationsHelper, getPartnerOrganizations, getGenericPartners
}
