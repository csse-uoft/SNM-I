const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");
const {getPredefinedProperty, getInternalTypeValues} = require('./helperFunctions')
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require('graphdb-utils');
const {GDBProgramWaitlistModel} = require("../../models/program/programWaitlist");
const {getIndividualsInClass} = require("../dynamicForm");
const {PredefinedCharacteristics} = require("../characteristics");
const {popFromWaitlist} = require("../serviceWaitlist/serviceWaitlist");

const programOccurrenceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty('programOccurrence', internalType);
  if (property === 'occurrenceOf') {
    instanceData[property] = value;
  } else if (property === 'needSatisfiers') {
    instanceData['needSatisfiers'] = value;
  }
};

const programOccurrenceInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['occurrenceOf', 'needSatisfiers'], data, 'programOccurrence');
}

const programOccurrenceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programOccurrenceInternalTypeCreateTreater(internalType, result, value);
}

const checkCapacityOnProgramOccurrenceUpdate = async function (characteristics, questions, fields, oldGeneric) {
  const capacityId = Object.keys(characteristics).find(id => characteristics[id].name === 'Capacity');
  if (!capacityId)
    return;
  const capacity = fields['characteristic_' + capacityId];
  if (capacity < oldGeneric.occupancy) {
    throw new Error('The new capacity of this program occurrence is less than its current occupancy. Please unregister '
      + 'program registrations until the occupancy is below the desired capacity, and then try editing this program '
      + 'occurrence again.');
  } else {
    const statuses = await getIndividualsInClass(':RegistrationStatus');
    const registeredStatus = Object.keys(statuses).find(status => statuses[status] === 'Registered');
    const statusC = PredefinedCharacteristics['Registration Status'];
    const occupancyC = PredefinedCharacteristics['Occupancy'];
    const occupancyCO = oldGeneric.characteristicOccurrences.find(co => co.occurrenceOf === occupancyC._uri);
    while (capacity > oldGeneric.occupancy) {
      const registration = await popFromWaitlist(oldGeneric._id);
      if (!!registration) {
        // Make the registration's status be 'Registered' and save it
        const statusCO = registration.characteristicOccurrences.find(co => co.occurrenceOf === statusC._uri);
        registration.status = registeredStatus;
        statusCO.dataStringValue = registeredStatus;
        await registration.save();
        
        oldGeneric.occupancy += 1;
        occupancyCO.dataNumberValue += 1;
      } else {
        break;
      }
    }
    await oldGeneric.save();
  }
}

const afterCreateProgramOccurrence = async function (data, req, newGeneric) {
  const occurrenceWaitlist = GDBProgramWaitlistModel({'programOccurrence': newGeneric, 'waitlist': []});
  // pass in the programOccurrence that was just created ("newGeneric")
  // and an empty list for the queue.
  await occurrenceWaitlist.save();
}

module.exports = {
  programOccurrenceInternalTypeCreateTreater,
  programOccurrenceInternalTypeFetchTreater,
  programOccurrenceInternalTypeUpdateTreater,
  checkCapacityOnProgramOccurrenceUpdate,
  afterCreateProgramOccurrence,
}
