const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");
const {linkedProperty} = require('./helper functions')
const {genericType2Model} = require("./index");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require('../../utils/graphdb/helpers');

const serviceOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = linkedProperty('serviceOccurrence', internalType);
  if (property === 'occurrenceOf') {
    instanceData[property] = value;
  } else if (property === 'needSatisfier') {
    instanceData['needSatisfiers'] = value;
    const needSatisfierOccurrences = [];
    for (let needSatisfierURI of value) {
      const [_, nsid] = needSatisfierURI.split('_');
      const needSatisfierOccurrenceData = {occurrenceOf: needSatisfierURI};
      const needSatisfier = await GDBNeedSatisfierModel.findById(nsid);
      needSatisfierOccurrenceData.address = needSatisfier.address;
      needSatisfierOccurrenceData.startDate = needSatisfier.startDate;
      needSatisfierOccurrenceData.endDate = needSatisfier.endDate;
      needSatisfierOccurrenceData.description = needSatisfier.description;
      const needSatisfierOccurrence = GDBNeedSatisfierOccurrenceModel(needSatisfierOccurrenceData);
      await needSatisfierOccurrence.save();
      needSatisfierOccurrences.push(needSatisfierOccurrence);
    }
    instanceData['needSatisfierOccurrences'] = needSatisfierOccurrences;
  }
};

const serviceOccurrenceInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if (property === 'occurrenceOf' || property === 'address' || property === 'needSatisfiers' || property ==='needSatisfierOccurrences') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: 'serviceOccurrence'});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
};

module.exports = {serviceOccurrenceInternalTypeCreateTreater, serviceOccurrenceInternalTypeFetchTreater}