const {linkedProperty} = require("./helper functions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");

const FORMTYPE = 'service'
const serviceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = linkedProperty(FORMTYPE, internalType);
  if (property === 'serviceProvider' || property === 'program'){
    instanceData[property] = value;
  }else if(property === 'needSatisfier'){
    instanceData[property + 's'] = value;
  }
}

const serviceInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if (property === 'serviceProvider'|| property === 'program') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }else if(property === 'needSatisfiers'){
      const propertyRemovedS = property.slice(0, -1);
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[propertyRemovedS].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = data[property].map(SPARQL.getFullURI);
    }
  }
  return result;
}

const serviceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {serviceInternalTypeCreateTreater, serviceInternalTypeFetchTreater, serviceInternalTypeUpdateTreater}