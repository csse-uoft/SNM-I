const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const FORMTYPE = 'programWaitlist'

const programWaitlistInternalTypeCreateTreater = async (internalType, instanceData, value) => { 
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'waitlist' || property === 'programOccurrence'){
    instanceData[property] = value;
  }
};

const programWaitlistInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema; 
  for (const property in data) {
    if (property === 'waitlist' || property === 'programOccurrence') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};

const programWaitlistInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programWaitlistInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {
  programWaitlistInternalTypeCreateTreater,
  programWaitlistInternalTypeFetchTreater,
  programWaitlistInternalTypeUpdateTreater
}