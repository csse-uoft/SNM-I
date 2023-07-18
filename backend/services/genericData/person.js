const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");
const FORMTYPE = 'person'

const personInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'address'){
    instanceData[property] = value;
  }
  instanceData.createDate = new Date();
};

const personInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema; 
  for (const property in data) {
    if (property === 'address'){
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
};


const personInternalTypeUpdateTreater = async (internalType, value, result) => {
  await personInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {personInternalTypeCreateTreater, personInternalTypeFetchTreater, personInternalTypeUpdateTreater}