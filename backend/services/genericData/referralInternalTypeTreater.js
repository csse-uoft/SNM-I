const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");

const FORMTYPE = 'referral'

const referralInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'client' || property === 'referringServiceProvider' || property === 'referringServiceProvider' ||
  property === 'receivingServiceProvider' || property === 'needOccurrence' || property === 'service' ||
  property === 'serviceOccurrence'){
    instanceData[property] = value;
  }
};

const referralInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if (property === 'client' || property === 'referringServiceProvider' || property === 'referringServiceProvider' ||
      property === 'receivingServiceProvider' || property === 'needOccurrence' || property === 'service' ||
      property === 'serviceOccurrence') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
}

const referralInternalTypeUpdateTreater = async (internalType, value, result) => {
  await referralInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {referralInternalTypeCreateTreater, referralInternalTypeFetchTreater, referralInternalTypeUpdateTreater}