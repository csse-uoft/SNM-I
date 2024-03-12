const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const FORMTYPE = 'waitlistEntry'

const waitlistEntryInternalTypeCreateTreater = async (internalType, instanceData, value) => { 
  //get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'serviceRegistration' || property === 'priority' || property === 'date'){
    instanceData[property] = value;
  }
};

const waitlistEntryInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema; 
  for (const property in data) {
    if (property === 'serviceRegistration' || property === 'priority' || property === 'date') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};


const waitlistEntryInternalTypeUpdateTreater = async (internalType, value, result) => {
  await waitlistEntryInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {waitlistEntryInternalTypeCreateTreater, waitlistEntryInternalTypeFetchTreater, waitlistEntryInternalTypeUpdateTreater}