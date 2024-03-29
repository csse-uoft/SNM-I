const {getPredefinedProperty, getInternalTypeValues} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const {GDBClientModel} = require("../../models");

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


const beforeDeleteOutcomeOccurrence = async (instanceData) => {
  // Delete client.outcomeOccurrence
  const client = await GDBClientModel.findByUri(instanceData.client);

  if (client.outcomeOccurrences) {
    client.outcomeOccurrences = client.outcomeOccurrences.filter(outcomeOcc => outcomeOcc === instanceData._uri);
    await client.save();
  }
}

module.exports = {outcomeOccurrenceInternalTypeCreateTreater, outcomeOccurrenceInternalTypeFetchTreater,
  outcomeOccurrenceInternalTypeUpdateTreater, beforeDeleteOutcomeOccurrence}
