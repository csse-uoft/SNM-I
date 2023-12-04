const {getPredefinedProperty, getInternalTypeValues} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");

const FORMTYPE = 'service'
const serviceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'serviceProvider' || property === 'program'){
    instanceData[property] = value;
  } else if (property === 'needSatisfiers') {
    instanceData['needSatisfiers'] = value;
  } else if (property === 'partnerOrganizations') {
    instanceData['partnerOrganizations'] = value;
  }
}

const serviceInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['serviceProvider', 'program', 'needSatisfiers', 'partnerOrganizations'], data, FORMTYPE)
}

const serviceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {serviceInternalTypeCreateTreater, serviceInternalTypeFetchTreater, serviceInternalTypeUpdateTreater}
