const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");
const {getPredefinedProperty, getInternalTypeValues} = require('./helperFunctions')
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require('graphdb-utils');

const serviceOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty('serviceOccurrence', internalType);
  if (property === 'occurrenceOf') {
    instanceData[property] = value;
  } else if (property === 'needSatisfiers') {
    instanceData['needSatisfiers'] = value;
  }
};

const serviceOccurrenceInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['occurrenceOf', 'needSatisfiers'], data, 'serviceOccurrence')
};

const serviceOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {serviceOccurrenceInternalTypeCreateTreater, serviceOccurrenceInternalTypeFetchTreater, serviceOccurrenceInternalTypeUpdateTreater, }
