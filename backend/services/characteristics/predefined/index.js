const client = require('./client');
const organization = require('./organization');
const allPredefinedCharacteristics = {};

for (const characteristic of [...client, ...organization]) {
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
