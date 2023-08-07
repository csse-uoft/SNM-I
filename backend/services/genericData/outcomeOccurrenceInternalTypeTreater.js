const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");

const FORMTYPE = 'outcomeOccurrence'

const outcomeOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'occurrenceOf') {
    instanceData[property] = value;
  }
};

const outcomeOccurrenceInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;

  if (data.occurrenceOf) {
    // Add client
    const client = await GDBClientModel.findOne({outcome: data.occurrenceOf});
    const internalType = await GDBInternalTypeModel.findOne({
      name: 'clientForOutcomeOccurrence',
      formType: FORMTYPE
    });
    result['internalType_' + internalType._id] = SPARQL.getFullURI(client.individualName);
  }

  for (const property in data) {
    if (property === 'occurrenceOf') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: 'outcomeOccurrence'});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
};

const outcomeOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await outcomeOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {outcomeOccurrenceInternalTypeCreateTreater, outcomeOccurrenceInternalTypeFetchTreater, outcomeOccurrenceInternalTypeUpdateTreater}
