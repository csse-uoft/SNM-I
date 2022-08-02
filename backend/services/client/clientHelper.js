const {GDBClientModel} = require("../../models");

async function findClientById(id) {
  return await GDBClientModel.findOne(
    {_id: id},
    {populates: ['characteristicOccs', 'questionOccs']}
  );
}

async function createClientHelper(data) {

}

module.exports = {findClientById, createClientHelper}