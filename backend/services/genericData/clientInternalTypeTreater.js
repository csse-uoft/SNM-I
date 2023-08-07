const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");

const FORMTYPE = 'client'

const clientInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'need') {
    instanceData.needs = value;
    instanceData.needOccurrences = [];
    // Create/Delete Need satisfier based on need
    for (const needURI of value) {
      instanceData.needOccurrences.push({
        occurrenceOf: needURI,
      });
    }
  }
  if (property === 'outcome') {
    instanceData.outcomes = value;
    instanceData.outcomeOccurrences = [];
    for (const outcomeURI of value) {
      instanceData.outcomeOccurrences.push({
        occurrenceOf: outcomeURI,
      });
    }
  }
};

const clientInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;
  if (data.needs) {
    const internalType = await GDBInternalTypeModel.findOne({
      predefinedProperty: schema.need.internalKey,
      formType: FORMTYPE
    });
    result[internalType.individualName.slice(1)] = data.needs.map(need => SPARQL.getFullURI(need));
  }
  if (data.outcomes) {
    const internalType = await GDBInternalTypeModel.findOne({
      predefinedProperty: schema.outcome.internalKey,
      formType: FORMTYPE
    });
    result[internalType.individualName.slice(1)] = data.outcomes.map(outcome => SPARQL.getFullURI(outcome));
  }
  return result;
};

const clientInternalTypeUpdateTreater = async (internalType, value, result) => {
  await clientInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {clientInternalTypeCreateTreater, clientInternalTypeFetchTreater, clientInternalTypeUpdateTreater}
