const { getPredefinedProperty, getInternalTypeValues } = require("./helperFunctions");
const { GDBInternalTypeModel } = require("../../models/internalType");
const { SPARQL } = require("graphdb-utils");
const {GDBClientModel} = require("../../models/ClientFunctionalities/client");
const {GDBNeedOccurrenceModel} = require("../../models/need/needOccurrence");
const {GDBOutcomeOccurrenceModel} = require("../../models/outcome/outcomeOccurrence");
const {PredefinedCharacteristics} = require("../characteristics");
const {GDBCOModel} = require("../../models/ClientFunctionalities/characteristicOccurrence");

const FORMTYPE = 'clientAssessment'

const beforeCreateClientAssessment = async function (instanceData, internalTypes, fields) {

  const clientInternalType = Object.values(internalTypes).find(internalType => getPredefinedProperty(FORMTYPE, internalType) === 'client');

  if (clientInternalType == null) {
    throw new Error("Client must be provided in a client assessment form.");
  }

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
  await beforeCreateClientAssessment(instanceData, internalTypes, fields);
}

const clientAssessmentInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  // get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);

  // Get start and end date cached Characteristics
  const startDateC = PredefinedCharacteristics['Start Date'];
  const endDateC = PredefinedCharacteristics['End Date'];
  // Get the COs
  const startDateCO = instanceData.characteristicOccurrences.find(co => co.occurrenceOf === startDateC._uri || co.occurrenceOf?._uri === startDateC._uri);
  const endDateCO = instanceData.characteristicOccurrences.find(co => co.occurrenceOf === endDateC._uri || co.occurrenceOf?._uri === endDateC._uri);
  const newCOs = [];
  // addIdToUsage is not called since it is not required for predefined characteristics
  if (startDateCO) {
    const data = startDateCO.toJSON ? startDateCO.toJSON() : startDateCO;
    delete data._id;
    newCOs.push(GDBCOModel(data));
  }
  if (endDateCO) {
    const data = endDateCO.toJSON ? endDateCO.toJSON() : endDateCO;
    delete data._id;
    newCOs.push(GDBCOModel(data));
  }

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
        client: instanceData.client,

        characteristicOccurrences: newCOs,
        startDate: startDateCO ? startDateCO.dataDateValue : undefined,
        endDate: endDateCO ? endDateCO.dataDateValue : undefined,
      }))
    }
  }

  else if (property === 'outcomes') {
    instanceData.outcomes = value;
    // Create need + need occurrence
    instanceData.client.outcomes.push(...value);

    for (const outcomeURI of value) {
      instanceData.client.outcomeOccurrences.push(GDBOutcomeOccurrenceModel({
        occurrenceOf: outcomeURI,
        client: instanceData.client,

        characteristicOccurrences: newCOs,
        startDate: startDateCO ? startDateCO.dataDateValue : undefined,
        endDate: endDateCO ? endDateCO.dataDateValue : undefined,
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
