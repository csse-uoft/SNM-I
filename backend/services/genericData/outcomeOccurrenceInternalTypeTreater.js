const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");

const FORMTYPE = 'outcomeOccurrence'

const outcomeOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'occurrenceOf' || property === 'person') {
    instanceData[property] = value;
  }
};

const outcomeOccurrenceInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;

  for (const property in data) {
    if (property === 'occurrenceOf' || property === 'person') {
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
