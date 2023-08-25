const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");
const {getPredefinedProperty, getInternalTypeValues} = require('./helperFunctions')
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require('graphdb-utils');

const programOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty('programOccurrence', internalType);
  if (property === 'occurrenceOf') {
    instanceData[property] = value;
  } else if (property === 'needSatisfiers') {
    instanceData['needSatisfiers'] = value;
  }
};

const programOccurrenceInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['occurrenceOf', 'needSatisfiers'], data, 'programOccurrence');
}

const programOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {programOccurrenceInternalTypeCreateTreater, programOccurrenceInternalTypeFetchTreater, programOccurrenceInternalTypeUpdateTreater, }
