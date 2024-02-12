const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const FORMTYPE = 'serviceWaitlist'

const serviceWaitlistInternalTypeCreateTreater = async (internalType, instanceData, value) => { 
  //get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  //if the property is client, person or user, then set the value to the instanceData
  if (property === 'clients' || property === 'service'){
    instanceData[property] = value;
  }
};

const serviceWaitlistInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema; 
  // for each property in data, if the property is client, person or user, then set the value to the result
  for (const property in data) {
    if (property === 'clients' || property === 'service') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};


const serviceWaitlistInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceWaitlistInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {serviceWaitlistInternalTypeCreateTreater, serviceWaitlistInternalTypeFetchTreater, serviceWaitlistInternalTypeUpdateTreater}