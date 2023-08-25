const {getPredefinedProperty, getInternalTypeValues} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");

const FORMTYPE = 'client'

const clientInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'needs') {
    instanceData.needs = value;
  }
  if (property === 'outcomes') {
    instanceData.outcomes = value;
  }
};

const clientInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['needs', 'outcomes'], data, FORMTYPE);
};

const clientInternalTypeUpdateTreater = async (internalType, value, result) => {
  await clientInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {clientInternalTypeCreateTreater, clientInternalTypeFetchTreater, clientInternalTypeUpdateTreater}
