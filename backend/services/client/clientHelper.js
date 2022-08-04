const {GDBClientModel, GDBOrganizationModel} = require("../../models");

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

async function createClientHelper(data) {
  const {questionOccurrences, characteristicOccurrences} = data
  const client = GDBClientModel({characteristicOccurrences, questionOccurrences})
  return client
}

async function updateClientHelper(data) {
  const {questionOccurrences, characteristicOccurrences, id} = data
  const client = await findClientById(id)

}


module.exports = {findClientById, findOrganizationById, createClientHelper, updateClientHelper}