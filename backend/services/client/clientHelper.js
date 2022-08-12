const {GDBClientModel, GDBOrganizationModel} = require("../../models");
const {findCharacteristicById} = require("../characteristics");
const {findQuestionById} = require("../question/questionHelper");

async function findClientById(id) {
  return await GDBClientModel.findOne(
    {_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrences']}
  );
}

async function findOrganizationById(id) {
  return await GDBOrganizationModel.findOne(
    {_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrences']}
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

      // Storing string value
      if (!!characteristic.dataStringValue) {
        charValue = characteristic.dataStringValue;
      }

      // Storing number value
      if (!!characteristic.dataNumberValue) {
        charValue = characteristic.dataNumberValue;
      }

      // Storing boolean value, convert to 'Yes' or 'No'
      if (typeof characteristic.dataBooleanValue !== 'undefined') {
        if (characteristic.dataBooleanValue === false) {
          charValue = 'No';
        } else if (characteristic.dataBooleanValue === true) {
          charValue = 'Yes';
        }
      }

      // Storing date value
      if (!!characteristic.dataDateValue) {
        // use toLocaleDateString() for date value
        // use toLocaleString() for date time value.
        const test = characteristic.dataDateValue;
        charValue = new Date(characteristic.dataDateValue).toLocaleString('en-US', {timeZone: 'UTC'});
      }

      // Storing object value
      if (!!characteristic.objectValue) {
        charValue = characteristic.objectValue;
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