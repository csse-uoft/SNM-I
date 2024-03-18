const {getPredefinedProperty, getInternalTypeValues} = require("./helperFunctions");
const {GDBProgramOccurrenceModel} = require("../../models/program/programOccurrence");
const {getIndividualsInClass} = require("../dynamicForm");
const {PredefinedCharacteristics, PredefinedInternalTypes} = require("../characteristics");

const FORMTYPE = 'programRegistration'

const programRegistrationInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'client' || property === 'referral' || property === 'appointment' ||
    property === 'programOccurrence' || property === 'needOccurrence') {
    instanceData[property] = value;
  }
};

const programRegistrationInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['client', 'referral', 'appointment', 'programOccurrence', 'needOccurrence'], data, FORMTYPE)
};

const programRegistrationInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programRegistrationInternalTypeCreateTreater(internalType, result, value);
}

const updateOccurrenceOccupancyOnProgramRegistrationCreate = async function (characteristics, questions, fields) {
  const statuses = await getIndividualsInClass(':RegistrationStatus');
  const status = statuses[fields[`characteristic_${PredefinedCharacteristics['Registration Status']._id}`]];
  const occUri = fields['internalType_' + PredefinedInternalTypes['programOccurrenceForProgramRegistration']._id];
  if (!occUri) return;
  const occ = await GDBProgramOccurrenceModel.findOne({_uri: occUri}, {populates: ['characteristicOccurrences']});
  if (status === 'Registered') {
    if (!occ.capacity || (occ.occupancy < occ.capacity)) {
      occ.occupancy += 1;
      const occupancyC = PredefinedCharacteristics['Occupancy'];
      const occupancyCO = occ.characteristicOccurrences.find(co => co.occurrenceOf === occupancyC._uri);
      occupancyCO.dataNumberValue += 1;
      occ.save();
    } else {
      throw new Error('The requested program occurrence is now at capacity. Please refresh the form to review your current options.');
    }
  } else if (status === 'Waitlisted') {
    // TODO: Push new registration to waitlist (probably after create instead of before)
  }
}

const checkProgramOccurrenceUnchanged = async function (characteristics, questions, fields, oldGeneric) {
  const newOccUri = fields['internalType_' + PredefinedInternalTypes['programOccurrenceForProgramRegistration']._id];
  const oldOccUri = oldGeneric.programOccurrence;
  if (newOccUri !== oldOccUri)
    throw new Error('A program registration\'s program occurrence cannot change.');
}

const updateOccurrenceOccupancyOnProgramRegistrationUpdate = async function (characteristics, questions, fields, oldGeneric) {
  // checkProgramOccurrenceUnchanged must be called before this
  const statuses = await getIndividualsInClass(':RegistrationStatus');
  const oldStatus = statuses[oldGeneric.status];
  const newStatus = statuses[fields[`characteristic_${PredefinedCharacteristics['Registration Status']._id}`]];
  const occUri = fields['internalType_' + PredefinedInternalTypes['programOccurrenceForProgramRegistration']._id];
  if (!occUri) return;
  const occ = await GDBProgramOccurrenceModel.findOne({_uri: occUri}, {populates: ['characteristicOccurrences']});
  const occupancyC = PredefinedCharacteristics['Occupancy'];
  const occupancyCO = occ.characteristicOccurrences.find(co => co.occurrenceOf === occupancyC._uri);
  if (oldStatus === 'Not Registered' && newStatus === 'Registered') {
    if (!occ.capacity || (occ.occupancy < occ.capacity)) {
      occ.occupancy += 1;
      occupancyCO.dataNumberValue += 1;
      occ.save();
    } else {
      throw new Error('The requested program occurrence is now at capacity. Please refresh the form to review your current options.');
    }
  } else if (oldStatus === 'Registered' && newStatus === 'Not Registered') {
    occ.occupancy -= 1;
    occupancyCO.dataNumberValue -= 1;
    occ.save();
    // TODO: Pop one registration from waitlist, if any, and change its status to registered
  } else if (oldStatus === 'Waitlisted' && newStatus === 'Not Registered') { // TODO: Remove this registration from waitlist
  } else if (oldStatus === 'Not Registered' && newStatus === 'Waitlisted') { // TODO: Push this registration to waitlist
  } else {
    throw new Error('Invalid registration status chosen.');
  }
}

const updateOccurrenceOccupancyOnProgramRegistrationDelete = async function (oldGeneric) {
  const statuses = await getIndividualsInClass(':RegistrationStatus');
  const status = statuses[oldGeneric.status];
  const occUri = oldGeneric.programOccurrence;
  if (!occUri) return;
  const occ = await GDBProgramOccurrenceModel.findOne({_uri: occUri}, {populates: ['characteristicOccurrences']});
  if (status === 'Registered') {
    occ.occupancy -= 1;
    const occupancyC = PredefinedCharacteristics['Occupancy'];
    const occupancyCO = occ.characteristicOccurrences.find(co => co.occurrenceOf === occupancyC._uri);
    occupancyCO.dataNumberValue -= 1;
    occ.save();
    // TODO: Pop one registration from waitlist, if any, and change its status to registered
  } else if (status === 'Waitlisted') { // TODO: Remove this registration from waitlist
  }
}

module.exports = {
  programRegistrationInternalTypeCreateTreater,
  programRegistrationInternalTypeFetchTreater,
  programRegistrationInternalTypeUpdateTreater,
  checkProgramOccurrenceUnchanged,
  updateOccurrenceOccupancyOnProgramRegistrationCreate,
  updateOccurrenceOccupancyOnProgramRegistrationUpdate,
  updateOccurrenceOccupancyOnProgramRegistrationDelete,
}
