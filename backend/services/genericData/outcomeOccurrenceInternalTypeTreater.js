const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");

const FORMTYPE = 'outcomeOccurrence'

const outcomeOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'occurrenceOf') {
    // should not update occurrenceOf
  }
};

const outcomeOccurrenceInternalTypeFetchTreater = async (data) => {
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

const outcomeOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await outcomeOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {outcomeOccurrenceInternalTypeCreateTreater, outcomeOccurrenceInternalTypeFetchTreater, outcomeOccurrenceInternalTypeUpdateTreater}
