const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");

const FORMTYPE = 'programRegistration'

const programRegistrationInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'client' || property === 'referral' || property === 'appointment' ||
    property == 'program') {
    instanceData[property] = value;
  }
};

const programRegistrationInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;
  for (const property in data) {
    if (property === 'client' || property === 'referral' || property === 'appointment' ||
      property == 'program') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema[property].internalKey,
        formType: FORMTYPE
      });
      result['internalType_' + internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
};

const programRegistrationInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programRegistrationInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {
  programRegistrationInternalTypeCreateTreater,
  programRegistrationInternalTypeFetchTreater,
  programRegistrationInternalTypeUpdateTreater
}
