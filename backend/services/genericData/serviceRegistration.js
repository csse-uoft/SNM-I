const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const {GDBClientModel} = require("../../models/ClientFunctionalities/client");
const {GDBServiceModel} = require("../../models/service/service");
const {GDBServiceOccurrenceModel} = require("../../models/service/serviceOccurrence");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");

const FORMTYPE = 'serviceRegistration'

const serviceRegistrationInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'client' || property === 'referral' || property === 'appointment' ||
    property === 'serviceOccurrence' || property === 'needOccurrence') {
    instanceData[property] = value;
  }
};

const serviceRegistrationInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;
  for (const property in data) {
    if (property === 'client' || property === 'referral' || property === 'appointment' ||
      property === 'serviceOccurrence' || property === 'needOccurrence') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema[property].internalKey,
        formType: FORMTYPE
      });
      result['internalType_' + internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};

const serviceRegistrationInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceRegistrationInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {
  serviceRegistrationInternalTypeCreateTreater,
  serviceRegistrationInternalTypeFetchTreater,
  serviceRegistrationInternalTypeUpdateTreater
}
