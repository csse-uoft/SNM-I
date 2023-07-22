const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");
const {getPredefinedProperty} = require('./helperFunctions')
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require('../../utils/graphdb/helpers');

const programOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty('programOccurrence', internalType);
  if (property === 'occurrenceOf') {
    instanceData[property] = value;
  } else if (property === 'needSatisfier') {
    instanceData['needSatisfiers'] = value;
  }
};

const programOccurrenceInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if (property === 'occurrenceOf') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: 'programOccurrence'});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }else if(property === 'needSatisfiers'){
      const propertyRemovedS = property.slice(0, -1);
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[propertyRemovedS].internalKey, formType: 'programOccurrence'});
      result[ 'internalType_'+ internalType._id] = data[property].map(SPARQL.getFullURI);
    }
  }
  return result;
};

const programOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {programOccurrenceInternalTypeCreateTreater, programOccurrenceInternalTypeFetchTreater, programOccurrenceInternalTypeUpdateTreater, }
