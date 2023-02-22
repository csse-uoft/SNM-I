const {linkedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");
const {GDBNeedModel} = require("../../models/need/need");

const FORMTYPE = 'needOccurrence'

const needOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = linkedProperty(FORMTYPE, internalType);
  if (property === 'occurrenceOf') {
    // should not update occurrenceOf
  }
};

const needOccurrenceInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;
  if (data.occurrenceOf) {
    const internalType = await GDBInternalTypeModel.findOne({
      predefinedProperty: schema.occurrenceOf.internalKey,
      formType: FORMTYPE
    });
    result[internalType.individualName.slice(1)] = SPARQL.getFullURI(data.occurrenceOf);

    // TODO: Find the corresponding client
    // result['readonly_client'] =
  }
  return result;
};

const needOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await needOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {needOccurrenceInternalTypeCreateTreater, needOccurrenceInternalTypeFetchTreater, needOccurrenceInternalTypeUpdateTreater}