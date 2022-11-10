const {linkedProperty} = require("./helper functions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");



const FORMTYPE = 'serviceRegistration'

const serviceRegistrationInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = linkedProperty(FORMTYPE, internalType);
  if (property === 'client' || property === 'referral' || property === 'appointment' ||
    property === 'serviceOccurrence'){
    instanceData[property] = value;
  }
};

const serviceRegistrationInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if (property === 'client' || property === 'referral' || property === 'appointment' ||
      property === 'serviceOccurrence') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
};

const serviceRegistrationInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceRegistrationInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {serviceRegistrationInternalTypeCreateTreater, serviceRegistrationInternalTypeFetchTreater, serviceRegistrationInternalTypeUpdateTreater}