const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const FORMTYPE = 'programWaitlist'

const programWaitlistInternalTypeCreateTreater = async (internalType, instanceData, value) => { 
  //get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  //if the property is client, person or user, then set the value to the instanceData
  if (property === 'clients' || property === 'programOccurrence'){
    instanceData[property] = value;
  }
};

const programWaitlistInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema; 
  // for each property in data, if the property is client, person or user, then set the value to the result
  for (const property in data) {
    if (property === 'clients' || property === 'programOccurence') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};


const programWaitlistInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programWaitlistInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {programWaitlistInternalTypeCreateTreater, programWaitlistInternalTypeFetchTreater, programWaitlistInternalTypeUpdateTreater}