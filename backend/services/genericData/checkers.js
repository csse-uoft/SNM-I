const {Server400Error} = require("../../utils");

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

function checkOccupancy(characteristics, questions, fields) {
  const occupancyId = Object.keys(characteristics).find(id => characteristics[id].name === 'Occupancy');
  if (!!occupancyId) {
    if (fields['characteristic_' + occupancyId] < 0) {
      throw new Server400Error('Occupancy must be zero or greater.');
    }
  }
}

module.exports = {noQuestion, checkCapacity, checkOccupancy}