const {linkedProperty} = require("./helper functions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");
const FORMTYPE = 'appointment'

const appointmentInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = linkedProperty(FORMTYPE, internalType);
  if (property === 'client' || property === 'person' || property === 'user'){
    instanceData[property] = value;
  }
};

const appointmentInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if (property === 'client' || property === 'person' || property === 'user') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
};


const appointmentInternalTypeUpdateTreater = async (internalType, value, result) => {
  await appointmentInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {appointmentInternalTypeCreateTreater, appointmentInternalTypeFetchTreater, appointmentInternalTypeUpdateTreater}