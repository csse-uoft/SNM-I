const { getPredefinedProperty, getInternalTypeValues } = require("./helperFunctions");
const { GDBInternalTypeModel } = require("../../models/internalType");
const { SPARQL } = require("graphdb-utils");
const {GDBClientModel} = require("../../models/ClientFunctionalities/client");
const {GDBNeedOccurrenceModel} = require("../../models/need/needOccurrence");
const {GDBOutcomeOccurrenceModel} = require("../../models/outcome/outcomeOccurrence");

const FORMTYPE = 'clientAssessment'

const beforeCreateClientAssessment = async function (instanceData, internalTypes, fields) {

  const clientInternalType = Object.values(internalTypes).find(internalType => getPredefinedProperty(FORMTYPE, internalType) === 'client');

  // Get the client
  if (fields['internalType_' + clientInternalType._id]) {
    const clientURI = SPARQL.ensureFullURI(fields['internalType_' + clientInternalType._id]);
    const client = await GDBClientModel.findOne({_uri: clientURI}, {populates: ['needOccurrences', 'outcomeOccurrences']});
    if (client.needs == null) client.needs = [];
    if (client.needOccurrences == null) client.needOccurrences = [];
    if (client.outcomes == null) client.outcomes = [];
    if (client.outcomeOccurrences == null) client.outcomeOccurrences = [];

    instanceData.client = client;
  }
}

const beforeUpdateClientAssessment = async function (instanceData, internalTypes, fields) {
  // Get the client
  if (instanceData.client) {
    const client = await GDBClientModel.findOne({_uri: instanceData.client}, {populates: ['needOccurrences', 'outcomeOccurrences']});

    if (client.needs == null) client.needs = [];
    if (client.needOccurrences == null) client.needOccurrences = [];
    if (client.outcomes == null) client.outcomes = [];
    if (client.outcomeOccurrences == null) client.outcomeOccurrences = [];

    instanceData.client = client;
  }
}

const clientAssessmentInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  // get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  // instantiate the property with the value
  if (property === 'person' || property === 'userAccount') {
    instanceData[property] = value;
  }
  else if (property === 'needs') {
    instanceData.needs = value;
    // Create need + need occurrence
    instanceData.client.needs.push(...value);

    for (const needURI of value) {
      instanceData.client.needOccurrences.push(GDBNeedOccurrenceModel({
        occurrenceOf: needURI,
        client: instanceData.client
      }))
    }
  }

  else if (property === 'outcomes') {
    instanceData.outcomes = value;
    instanceData.client.outcomes.push(...value);

    for (const outcomeURI of value) {
      instanceData.client.outcomeOccurrences.push(GDBOutcomeOccurrenceModel({
        occurrenceOf: outcomeURI
      }))
    }
  }
  else if (property === 'questions') {
    instanceData.questions = value;
    instanceData.questionOccurrences = [];
    for (const questionURI of value) {
      instanceData.questionOccurrences.push({
        occurrenceOf: questionURI,
      });
    }
  }
}

const clientAssessmentInternalTypeFetchTreater = async (doc) => {
  return getInternalTypeValues(['client', 'person', 'userAccount', 'outcomes', 'needs', 'questions'], doc, FORMTYPE)
}

const clientAssessmentInternalTypeUpdateTreater = async (internalType, value, result) => {
  await clientAssessmentInternalTypeCreateTreater(internalType, result, value);
}


module.exports = {
  clientAssessmentInternalTypeCreateTreater,
  clientAssessmentInternalTypeFetchTreater,
  clientAssessmentInternalTypeUpdateTreater,
  beforeCreateClientAssessment,
  beforeUpdateClientAssessment
}
