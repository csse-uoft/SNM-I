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
    if (property === 'occurrenceOf' || property === 'address') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: 'serviceOccurrence'});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }else if(property === 'needSatisfiers'){
      const propertyRemovedS = property.slice(0, -1);
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[propertyRemovedS].internalKey, formType: 'serviceOccurrence'});
      result[ 'internalType_'+ internalType._id] = data[property].map(SPARQL.getFullURI);
    }
  }
  return result;
};

const serviceOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  const property = linkedProperty('serviceOccurrence', internalType);
  if (property === 'occurrenceOf') {
    result[property] = value;
  } else if (property === 'needSatisfier') {
    let previousNeedSatisfiers = result.needSatisfiers;
    let previousNeedSatisfierOccurrences = result.needSatisfierOccurrences;


    for (let key in previousNeedSatisfierOccurrences){
      previousNeedSatisfierOccurrences[key] = await GDBNeedSatisfierOccurrenceModel.findById(previousNeedSatisfierOccurrences[key].split('_')[1]);
    }

    // check previous needSatisfer which no long in the list and remove their needSatisfierOccurrence
    previousNeedSatisfiers = previousNeedSatisfiers.map(
      (previousNeedSatisfier) => {
        if(!value.includes(SPARQL.getFullURI(previousNeedSatisfier))){
          // remove corresponding needSatisfierOccurrence
          const correspondingNeedSatisfierOccurrence = previousNeedSatisfierOccurrences.filter(
            (needSatisfierOccurrence) => {
              return needSatisfierOccurrence.occurrenceOf === previousNeedSatisfier;
          })[0];
          previousNeedSatisfierOccurrences = previousNeedSatisfierOccurrences.filter(nso => {
            return nso._id !== correspondingNeedSatisfierOccurrence._id
          })
          GDBNeedSatisfierOccurrenceModel.findByIdAndDelete(correspondingNeedSatisfierOccurrence._id);
          return false;
        } else {
          return previousNeedSatisfier;
        }
      }
    );

    previousNeedSatisfiers = previousNeedSatisfiers.filter(previousNeedSatisfier => {
      return previousNeedSatisfier;
    })

    // take new needSatisfiers and add correspongding needSatisfier Occurrence in
    for (let needSatisfierURI of value) {
      if(!previousNeedSatisfiers.includes(SPARQL.getPrefixedURI(needSatisfierURI))){
        const [_, nsid] = needSatisfierURI.split('_');
        const needSatisfierOccurrenceData = {occurrenceOf: needSatisfierURI};
        const needSatisfier = await GDBNeedSatisfierModel.findById(nsid);
        needSatisfierOccurrenceData.address = needSatisfier.address;
        needSatisfierOccurrenceData.startDate = needSatisfier.startDate;
        needSatisfierOccurrenceData.endDate = needSatisfier.endDate;
        needSatisfierOccurrenceData.description = needSatisfier.description;
        const needSatisfierOccurrence = GDBNeedSatisfierOccurrenceModel(needSatisfierOccurrenceData);
        await needSatisfierOccurrence.save();
        previousNeedSatisfierOccurrences.push(needSatisfierOccurrence);
      }
    }
    result.needSatisfiers = value;
    result.needSatisfierOccurrences = previousNeedSatisfierOccurrences;
  }
}

const serviceOccurrenceInternalTypeDeleteTreater = () => {

}

module.exports = {serviceOccurrenceInternalTypeCreateTreater, serviceOccurrenceInternalTypeFetchTreater, serviceOccurrenceInternalTypeUpdateTreater,
  serviceOccurrenceInternalTypeDeleteTreater}