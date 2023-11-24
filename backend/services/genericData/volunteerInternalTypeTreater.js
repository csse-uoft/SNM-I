const {getPredefinedProperty, getInternalTypeValues} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");

const FORMTYPE = 'volunteer'
const volunteerInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'partnerOrganizations' || property === 'organization'){
    instanceData[property] = value;
  }
}

const volunteerInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['partnerOrganizations', 'organization'], data, FORMTYPE)
}

const volunteerInternalTypeUpdateTreater = async (internalType, value, result) => {
  await volunteerInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {volunteerInternalTypeCreateTreater, volunteerInternalTypeFetchTreater, volunteerInternalTypeUpdateTreater}
