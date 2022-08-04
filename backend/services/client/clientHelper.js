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


module.exports = {
  findClientById, findOrganizationById, updateClientHelper, deleteHelper}