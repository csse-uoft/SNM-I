const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");
const {GDBClientModel} = require("../../models/ClientFunctionalities/client");
const {GDBProgramModel} = require("../../models/program/program");


const FORMTYPE = 'programProvision'

const programProvisionInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  // TODO: Unused value
};

const programProvisionInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;
  // TODO: Unchanged value
  return result;
};

const programProvisionInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programProvisionInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {
  programProvisionInternalTypeCreateTreater,
  programProvisionInternalTypeFetchTreater,
  programProvisionInternalTypeUpdateTreater
}
