const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");

const FORMTYPE = 'referral'

const referralInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'client' || property === 'referringServiceProvider' || property === 'referringServiceProvider' ||
  property === 'receivingServiceProvider' || property === 'needOccurrence' || property === 'service' ||
  property === 'serviceOccurrence' || property === 'program' || property === 'programOccurrence'){
    instanceData[property] = value;
  }
};

const referralInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if (property === 'client' || property === 'referringServiceProvider' || property === 'referringServiceProvider' ||
      property === 'receivingServiceProvider' || property === 'needOccurrence' || property === 'service' ||
      property === 'serviceOccurrence' || property === 'program' || property === 'programOccurrence') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
}

const referralInternalTypeUpdateTreater = async (internalType, value, result) => {
  await referralInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {referralInternalTypeCreateTreater, referralInternalTypeFetchTreater, referralInternalTypeUpdateTreater}
