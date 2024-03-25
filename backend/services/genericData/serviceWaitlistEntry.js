const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const FORMTYPE = 'waitlistEntry'

const serviceWaitlistEntryInternalTypeCreateTreater = async (internalType, instanceData, value) => { 
  //get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'serviceRegistration'){
    instanceData[property] = value;
  }
};

const serviceWaitlistEntryInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema; 
  for (const property in data) {
    if (property === 'serviceRegistration') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};

const serviceWaitlistEntryInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceWaitlistEntryInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {
  serviceWaitlistEntryInternalTypeCreateTreater,
  serviceWaitlistEntryInternalTypeFetchTreater,
  serviceWaitlistEntryInternalTypeUpdateTreater
}