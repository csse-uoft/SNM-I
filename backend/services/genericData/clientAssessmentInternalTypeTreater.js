const { getPredefinedProperty } = require("./helperFunctions");
const { GDBInternalTypeModel } = require("../../models/internalType");
const { SPARQL } = require("graphdb-utils");


const FORMTYPE = 'clientAssessment'

const clientAssessmentInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  // get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  // instantiate the property with the value
  if (property === 'client' || property === 'person' ||
    property === 'userAccount') {
    instanceData[property] = value;
  }
  else if (property === 'need') {
    instanceData.needs = value;
    instanceData.needOccurrences = [];
    for (const needURI of value) {
      instanceData.needOccurrences.push({
        occurrenceOf: needURI,
      });
    }
  }
  else if (property === 'outcome') {
    instanceData.outcomes = value;
    instanceData.outcomeOccurrences = [];
    for (const outcomeURI of value) {
      instanceData.outcomeOccurrences.push({
        occurrenceOf: outcomeURI,
      });
    }
  }
  else if (property === 'question') {
    instanceData.questions = value;
    instanceData.questionOccurrences = [];
    for (const questionURI of value) {
      instanceData.questionOccurrences.push({
        occurrenceOf: questionURI,
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
    result[internalType.individualName.slice(1)] = data.outcomes.map(outcome => SPARQL.ensureFullURI(outcome));
  }
  if (data.needs) {
    const internalType = await GDBInternalTypeModel.findOne({
      predefinedProperty: schema.need.internalKey,
      formType: FORMTYPE
    });
    result[internalType.individualName.slice(1)] = data.needs.map(need => SPARQL.ensureFullURI(need));
  }

  for (const property in data) {

    if (property === 'client' || property === 'person' || property === 'userAccount') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema[property].internalKey,
        formType: FORMTYPE
      });
      result['internalType_' + internalType._id] = SPARQL.ensureFullURI(data[property]);
    }

    else if (property === 'needs') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema.need.internalKey,
        formType: FORMTYPE
      });
      result[internalType.individualName.slice(1)] = data.needs.map(need => SPARQL.ensureFullURI(need));
    }

    else if (property === 'outcomes') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema.outcome.internalKey,
        formType: FORMTYPE
      });
      result[internalType.individualName.slice(1)] = data.outcomes.map(outcome => SPARQL.ensureFullURI(outcome));
    }

    else if (property === 'questions') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema.question.internalKey,
        formType: FORMTYPE
      });
      result[internalType.individualName.slice(1)] = data.questions.map(question => SPARQL.ensureFullURI(question));
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
