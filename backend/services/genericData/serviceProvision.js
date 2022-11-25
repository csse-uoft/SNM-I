const {linkedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");



const FORMTYPE = 'serviceProvision'

const serviceProvisionInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = linkedProperty(FORMTYPE, internalType);
  if (property === 'needOccurrence' || property === 'serviceOccurrence' || property === 'needSatisfierOccurrence'){
    instanceData[property] = value;
  }
};

const serviceProvisionInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if (property === 'needOccurrence' || property === 'serviceOccurrence' || property === 'needSatisfierOccurrence') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
};

const serviceProvisionInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceProvisionInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {serviceProvisionInternalTypeCreateTreater, serviceProvisionInternalTypeFetchTreater, serviceProvisionInternalTypeUpdateTreater}