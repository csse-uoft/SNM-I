const client = require('./client');
const allPredefinedCharacteristics = {};

for (const characteristic of client) {
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
