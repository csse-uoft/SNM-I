const {GDBClientModel, GDBOrganizationModel} = require("../../models");
const {findCharacteristicById} = require("../characteristics");
const {findQuestionById} = require("../question/questionHelper");

async function findClientById(id) {
  return await GDBClientModel.findOne(
    {_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrence']}
  );
}

async function findOrganizationById(id) {
  return await GDBOrganizationModel.findOne(
    {_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrence']}
  );
}

async function updateClientHelper(data) {
  const {questionOccurrences, characteristicOccurrences, id} = data
  const client = await findClientById(id)

}

async function deleteHelper(option, id) {
  // Delete unused forms and occurrence for a client
  if(option === 'client') {
    const client = await findClientById(id);

  }

  // Delete unused forms and occurrence for an organization
  if(option === 'organization') {

  }
}

async function parseHelper(data) {
  const displayAll = {};
  let countChar, countQues;

  if (data.characteristicOccurrences) {
    for (countChar in data.characteristicOccurrences) {
      const characteristic = data.characteristicOccurrences[countChar];
      const [char, charId] = characteristic.occurrenceOf.split('_');
      const result = await findCharacteristicById(charId);
      let charValue;
      if (!!characteristic.dataStringValue) {
        charValue = characteristic.dataStringValue;
      }
      if (!!characteristic.dataNumberValue) {
        charValue = characteristic.dataNumberValue;
      }
      if (!!characteristic.dataBooleanValue) {
        charValue = characteristic.dataBooleanValue;
      }
      if (!!characteristic.dataDateValue) {
        charValue = characteristic.dataDateValue;
      }

      displayAll[result.implementation.label] = charValue;
    }
  }

  if (data.questionOccurrences) {
    for (countQues in data.questionOccurrences) {
      const question = data.questionOccurrences[countQues];
      const [ques, quesId] = question.occurrenceOf.split('_');
      const result = await findQuestionById(quesId);
      displayAll[result.content] = question.stringValue;
    }
  }

  return displayAll
}


module.exports = {
  findClientById, findOrganizationById, updateClientHelper, deleteHelper, parseHelper}