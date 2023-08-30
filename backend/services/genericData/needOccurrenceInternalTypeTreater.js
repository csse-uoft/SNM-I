const {getPredefinedProperty, getInternalTypeValues} = require("./helperFunctions");
const {GDBClientModel} = require("../../models/ClientFunctionalities/client");

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

const beforeDeleteNeedOccurrence = async (instanceData) => {
  // Delete client.needOccurrence
  const client = await GDBClientModel.findByUri(instanceData.client);

  if (client.needOccurrences) {
    client.needOccurrences = client.needOccurrences.filter(needOcc => needOcc === instanceData._uri);
    await client.save();
  }
}

module.exports = {needOccurrenceInternalTypeCreateTreater, needOccurrenceInternalTypeFetchTreater,
  needOccurrenceInternalTypeUpdateTreater, beforeDeleteNeedOccurrence}
