const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");
const FORMTYPE = 'person'

const personInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  //get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'address'){
    instanceData[property] = value;
  }
  instanceData.createDate = new Date();
};

const personInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema; 
  // for (const property in data) {
  //   // if the property is address, then set the value to the result
  //   if (property === 'gender'){
  //     result['gender'] = property.slice(2);
  //   }
  // }
  return result;
};


const personInternalTypeUpdateTreater = async (internalType, value, result) => {
  await personInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {personInternalTypeCreateTreater, personInternalTypeFetchTreater, personInternalTypeUpdateTreater}