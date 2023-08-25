const {getPredefinedProperty} = require("./helperFunctions");
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
  const result = {};
  const schema = data.schema;

  for (const property in data) {
    if (property === 'occurrenceOf') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: 'needOccurrence'});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    } else if (property === 'needSatisfiers') {
      const propertyRemovedS = property.slice(0, -1);
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[propertyRemovedS].internalKey, formType: 'outcomeOccurrence'});
      result[ 'internalType_'+ internalType._id] = data[property].map(SPARQL.getFullURI);
    }
  }
  return result;
};

const needOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await needOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {needOccurrenceInternalTypeCreateTreater, needOccurrenceInternalTypeFetchTreater, needOccurrenceInternalTypeUpdateTreater}
