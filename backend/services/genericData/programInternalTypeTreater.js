const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");

const FORMTYPE = 'program'
const programInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'serviceProvider' || property === 'manager'){
    instanceData[property] = value;
  } else if (property === 'needSatisfier') {
    instanceData[property + 's'] = value;
  }
}

const programInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if (property === 'serviceProvider' || property === 'manager') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.ensureFullURI(data[property]);
    } else if (property === 'needSatisfiers') {
      const propertyRemovedS = property.slice(0, -1);
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[propertyRemovedS].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = data[property].map(SPARQL.ensureFullURI);
    }
  }
  return result;
}

const programInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {programInternalTypeCreateTreater, programInternalTypeFetchTreater, programInternalTypeUpdateTreater}
