import {GDBCharacteristicModel} from "../../models";


async function findCharacteristicById(id) {
  return await GDBCharacteristicModel.findOne(
    {_id: id}, {populates: ['implementation.fieldType', 'implementation.options']}
  );
}


module.exports = {findCharacteristicById}
