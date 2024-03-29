const client = require('./client');
const serviceProvider = require('./organization');
const service = require('./service');
const program = require('./program');
const appointment = require('./appointment');
const serviceOccurrence = require('./serviceOccurrence');
const referral = require('./referral');
const notification = require('./notification');
const internalTypes = require('./internalTypes');
const general = require('./general')

const allPredefinedCharacteristics = {};
const allPredefinedInternalType = {};

for (const characteristic of [...client, ...serviceProvider, ...service, ...serviceOccurrence,
  ...program, ...appointment, ...general, ...referral, ...notification]) {
  if (allPredefinedCharacteristics[characteristic.name]) {
    throw Error(`Duplicated name in predefined characteristics: ${characteristic.name}`);
  } else {
    characteristic.isPredefined = true;
    allPredefinedCharacteristics[characteristic.name] = characteristic;
  }
}

for (const internalType of [...internalTypes]) {
  if (allPredefinedInternalType[internalType.name]) {
    throw Error(`Duplicated name in predefined internalType: ${internalType.name}`);
  } else {
    internalType.isPredefined = true;
    allPredefinedInternalType[internalType.name] = internalType
  }
}

module.exports = {
  allPredefinedCharacteristics, allPredefinedInternalType
};
