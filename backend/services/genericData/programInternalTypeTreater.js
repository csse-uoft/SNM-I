const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");

const FORMTYPE = 'program'
const programInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  // TODO: nothing to do?
}

const programInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  // TODO: nothing to do?
  return result;
}

const programInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {programInternalTypeCreateTreater, programInternalTypeFetchTreater, programInternalTypeUpdateTreater}
