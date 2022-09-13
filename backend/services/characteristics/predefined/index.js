const client = require('./client');
const serviceProvider = require('./organization');
const service = require('./service')
const program = require('./program')
const appointment = require('./appointment')

const allPredefinedCharacteristics = {};

for (const characteristic of [...client, ...serviceProvider, ...service, ...program, ...appointment]) {
  if (allPredefinedCharacteristics[characteristic.name]) {
    throw Error(`Duplicated name in predefined characteristics: ${characteristic.name}`);
  } else {
    characteristic.isPredefined = true;
    allPredefinedCharacteristics[characteristic.name] = characteristic;
  }
}

module.exports = {
  allPredefinedCharacteristics
}
