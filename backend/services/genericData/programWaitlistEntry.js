const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const FORMTYPE = 'waitlistEntry'

const programWaitlistEntryInternalTypeCreateTreater = async (internalType, instanceData, value) => { 
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'programRegistration'){
    instanceData[property] = value;
  }
};

const programWaitlistEntryInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema; 
  for (const property in data) {
    if (property === 'programRegistration') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};


const programWaitlistEntryInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programWaitlistEntryInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {programWaitlistEntryInternalTypeCreateTreater, programWaitlistEntryInternalTypeFetchTreater, programWaitlistEntryInternalTypeUpdateTreater}