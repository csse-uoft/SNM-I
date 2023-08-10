const { getPredefinedProperty } = require("./helperFunctions");
const { GDBInternalTypeModel } = require("../../models/internalType");
const { SPARQL } = require("../../utils/graphdb/helpers");


const FORMTYPE = 'clientAssessment'

const clientAssessmentInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  // get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  // instantiate the property with the value
  if (property === 'client' || property === 'person' || property === 'userAccount') {
    instanceData[property] = value;
  }
  if (property === 'outcome') {
    instanceData.outcomes = value;

    // These outcomeOccurrences will not be stored in the ClientAssessment but
    // rather in the Client (see ./index: updateClient)
    instanceData.outcomeOccurrences = [];
    for (const outcomeURI of value) {
      instanceData.outcomeOccurrences.push({
        occurrenceOf: outcomeURI,
      });
    }
  }
}

const clientAssessmentInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;

  if (data.outcomes) {
    const internalType = await GDBInternalTypeModel.findOne({
      predefinedProperty: schema.outcome.internalKey,
      formType: FORMTYPE
    });
    result[internalType.individualName.slice(1)] = data.outcomes.map(outcome => SPARQL.getFullURI(outcome));
  }

  for (const property in data) {
    if (property === 'client' || property === 'person' || property === 'userAccount') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema[property].internalKey,
        formType: FORMTYPE
      });
      result['internalType_' + internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
}

const clientAssessmentInternalTypeUpdateTreater = async (internalType, value, result) => {
  await clientAssessmentInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {
  clientAssessmentInternalTypeCreateTreater,
  clientAssessmentInternalTypeFetchTreater,
  clientAssessmentInternalTypeUpdateTreater
}
