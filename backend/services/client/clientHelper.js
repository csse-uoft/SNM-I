const {GDBClientModel, GDBOrganizationModel} = require("../../models");

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


module.exports = {
  findClientById, findOrganizationById}