const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");

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

const serviceOccurrenceInternalTypeFetchTreater = () => {

};

module.exports = {serviceOccurrenceInternalTypeCreateTreater, serviceOccurrenceInternalTypeFetchTreater}