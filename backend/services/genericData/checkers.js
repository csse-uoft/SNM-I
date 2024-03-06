const {GDBCharacteristicModel} = require("../../models");
const {Server400Error} = require("../../utils");
const {PredefinedCharacteristics} = require("../characteristics");

function noQuestion(characteristics, questions) {
  if (Object.keys(questions).length > 0)
    throw new Server400Error('Service should not contain question.');
}

function checkCapacity(characteristics, questions, fields) {
  const capacityId = Object.keys(characteristics).find(id => characteristics[id].name === 'Capacity');
  if (!!capacityId) {
    if (fields['characteristic_' + capacityId] < 0) {
      throw new Server400Error('Capacity must be zero or greater.');
    }
  }
}

function unsetOccupancy(characteristics, questions, fields) {
  const occupancyId = PredefinedCharacteristics['Occupancy']._id;
  delete characteristics[occupancyId];
  delete fields[`characteristic_${occupancyId}`];
}

async function setOccupancy(characteristics, questions, fields) {
  const occupancyId = PredefinedCharacteristics['Occupancy']._id;
  const occupancyCharacteristic = await GDBCharacteristicModel.findOne({_id: occupancyId},
                                                                       {populates: ['implementation']});
  characteristics[occupancyId] = occupancyCharacteristic;
  fields[`characteristic_${occupancyId}`] = '0';
}

module.exports = {noQuestion, checkCapacity, unsetOccupancy, setOccupancy}