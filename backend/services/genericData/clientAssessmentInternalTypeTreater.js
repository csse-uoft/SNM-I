const { getPredefinedProperty } = require("./helperFunctions");
const { GDBInternalTypeModel } = require("../../models/internalType");
const { SPARQL } = require("../../utils/graphdb/helpers");

const FORMTYPE = 'clientAssessment'

const clientAssessmentInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  // get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  // instantiate the property with the value
  if (property === 'client' || property === 'person' || property === 'userAccount' || property === 'outcome') {
    instanceData[property] = value;
  }
}

const clientAssessmentInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;
  for (const property in data) {

    if (property === 'client' || property === 'person' || property === 'userAccount' || property === 'outcome') {
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
