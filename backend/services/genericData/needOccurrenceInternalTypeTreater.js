const {getPredefinedProperty, getInternalTypeValues} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");

const FORMTYPE = 'needOccurrence'

const needOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'occurrenceOf') {
    instanceData[property] = value;
  }
};

const needOccurrenceInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['occurrenceOf', 'needSatisfiers'], data, FORMTYPE)
};

const needOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await needOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {needOccurrenceInternalTypeCreateTreater, needOccurrenceInternalTypeFetchTreater, needOccurrenceInternalTypeUpdateTreater}
