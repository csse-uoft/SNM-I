const {getPredefinedProperty, getInternalTypeValues} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const {GDBClientModel} = require("../../models/ClientFunctionalities/client");
const {GDBProgramModel} = require("../../models/program/program");
const {GDBProgramOccurrenceModel} = require("../../models/program/programOccurrence");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");

const FORMTYPE = 'programRegistration'

const programRegistrationInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'client' || property === 'referral' || property === 'appointment' ||
    property === 'programOccurrence' || property === 'needOccurrence') {
    instanceData[property] = value;
  }
};

const programRegistrationInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['client', 'referral', 'appointment', 'programOccurrence', 'needOccurrence'], data, FORMTYPE)
};

const programRegistrationInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programRegistrationInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {
  programRegistrationInternalTypeCreateTreater,
  programRegistrationInternalTypeFetchTreater,
  programRegistrationInternalTypeUpdateTreater
}
