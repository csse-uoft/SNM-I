const {GDBClientModel, GDBOrganizationModel} = require("../../models");

async function findOrganizationById(id) {
  return await GDBClientModel.findOne(
    {_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrence']}
  );
}

async function createOrganizationHelper(data) {
  const {questionOccurrences, characteristicOccurrences} = data;
  return GDBOrganizationModel({characteristicOccurrences, questionOccurrences});
}

async function updateOrganizationHelper(data) {
  const {questionOccurrences, characteristicOccurrences, id} = data;
  const organization = await findOrganizationById(id);

}


module.exports = {findOrganizationById, createOrganizationHelper, updateOrganizationHelper}