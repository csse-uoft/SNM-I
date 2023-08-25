const {getPredefinedProperty, getInternalTypeValues} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");

const FORMTYPE = 'outcomeOccurrence'

const outcomeOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'occurrenceOf') {
    instanceData[property] = value;
  }
};

const outcomeOccurrenceInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['occurrenceOf'], data, FORMTYPE);
};

const outcomeOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await outcomeOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {outcomeOccurrenceInternalTypeCreateTreater, outcomeOccurrenceInternalTypeFetchTreater, outcomeOccurrenceInternalTypeUpdateTreater}
