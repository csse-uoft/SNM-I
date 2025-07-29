const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const {GDBServiceOccurrenceModel} = require("../../models/service/serviceOccurrence");
const {getIndividualsInClass} = require("../dynamicForm");
const {PredefinedCharacteristics, PredefinedInternalTypes} = require("../characteristics");
const {pushToWaitlist, popFromWaitlist, removeFromWaitlist} = require("../serviceWaitlist/serviceWaitlist");

const FORMTYPE = 'serviceRegistration'

const serviceRegistrationInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'client' || property === 'referral' || property === 'appointment' ||
    property === 'serviceOccurrence' || property === 'needOccurrence') {
    instanceData[property] = value;
  }
};

const serviceRegistrationInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;
  for (const property in data) {
    if (property === 'client' || property === 'referral' || property === 'appointment' ||
      property === 'serviceOccurrence' || property === 'needOccurrence') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema[property].internalKey,
        formType: FORMTYPE
      });
      result['internalType_' + internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};

const serviceRegistrationInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceRegistrationInternalTypeCreateTreater(internalType, result, value);
}

const updateOccurrenceOccupancyOnServiceRegistrationCreate = async function (characteristics, questions, fields) {
  const statuses = await getIndividualsInClass(':RegistrationStatus');
  const status = statuses[fields[`characteristic_${PredefinedCharacteristics['Registration Status']._id}`]];
  const occUri = fields['internalType_' + PredefinedInternalTypes['serviceOccurrenceForServiceRegistration']._id];
  if (!occUri)
    return;
  const occ = await GDBServiceOccurrenceModel.findOne({_uri: occUri}, {populates: ['characteristicOccurrences']});
  if (!occ)
    return;
  if (status === 'Registered') {
    if (!occ.capacity || (occ.occupancy < occ.capacity)) {
      occ.occupancy += 1;
      const occupancyC = PredefinedCharacteristics['Occupancy'];
      const occupancyCO = occ.characteristicOccurrences.find(co => co.occurrenceOf === occupancyC._uri);
      occupancyCO.dataNumberValue += 1;
      await occ.save();
    } else {
      throw new Error('The requested service occurrence is now at capacity. Please refresh the form to review your current options.');
    }
  } else if (status === 'Waitlisted') {
    // Registration will be pushed to waitlist after creation
  } else if (status !== 'Not Registered') {
    throw new Error('Invalid registration status chosen.');
  }
}

const afterCreateServiceRegistration = async function (data, req, newGeneric) {
  // If the new service registration is waitlisted, push it to the appropriate waitlist
  const statuses = await getIndividualsInClass(':RegistrationStatus');
  if (statuses[newGeneric.status] === 'Waitlisted') {
    const date = new Date();
    await pushToWaitlist(newGeneric.serviceOccurrence.split('_')[1], newGeneric._id, date, date);
  }
}

const checkServiceOccurrenceUnchanged = async function (characteristics, questions, fields, oldGeneric) {
  const newOccUri = fields['internalType_' + PredefinedInternalTypes['serviceOccurrenceForServiceRegistration']._id];
  const oldOccUri = oldGeneric.serviceOccurrence;
  if (newOccUri !== oldOccUri)
    throw new Error('A service registration\'s service occurrence cannot change.');
}

const updateOccurrenceOccupancyOnServiceRegistrationUpdate = async function (characteristics, questions, fields, oldGeneric) {
  // checkServiceOccurrenceUnchanged must be called before this
  const statuses = await getIndividualsInClass(':RegistrationStatus');
  const oldStatus = statuses[oldGeneric.status];
  const newStatus = statuses[fields[`characteristic_${PredefinedCharacteristics['Registration Status']._id}`]];
  const occUri = fields['internalType_' + PredefinedInternalTypes['serviceOccurrenceForServiceRegistration']._id];
  if (!occUri)
    return;
  const occ = await GDBServiceOccurrenceModel.findOne({_uri: occUri}, {populates: ['characteristicOccurrences']});
  if (!occ)
    return;
  const occupancyC = PredefinedCharacteristics['Occupancy'];
  const occupancyCO = occ.characteristicOccurrences.find(co => co.occurrenceOf === occupancyC._uri);
  if (oldStatus === 'Not Registered' && newStatus === 'Registered') {
    if (!occ.capacity || (occ.occupancy < occ.capacity)) {
      occ.occupancy += 1;
      occupancyCO.dataNumberValue += 1;
      await occ.save();
    } else {
      throw new Error('The requested service occurrence is now at capacity. Please refresh the form to review your current options.');
    }
  } else if (oldStatus === 'Registered' && newStatus === 'Not Registered') {
    // Pop one registration from waitlist, if any, and change its status to registered
    const registration = await popFromWaitlist(occ._id);
    if (!!registration) {
      const statuses = await getIndividualsInClass(':RegistrationStatus');
      const registeredStatus = Object.keys(statuses).find(status => statuses[status] === 'Registered');
      const statusC = PredefinedCharacteristics['Registration Status'];
      const statusCO = registration.characteristicOccurrences.find(co => co.occurrenceOf === statusC._uri);
      registration.status = registeredStatus;
      statusCO.dataStringValue = registeredStatus;
      await registration.save();
      // occ.occupancy doesn't change
    } else {
      occ.occupancy -= 1;
      occupancyCO.dataNumberValue -= 1;
      await occ.save();
    }
  } else if (oldStatus === 'Waitlisted' && newStatus === 'Not Registered') {
    // Remove this registration from waitlist
    await removeFromWaitlist(oldGeneric.serviceOccurrence.split('_')[1], oldGeneric._id);
  } else if (oldStatus === 'Not Registered' && newStatus === 'Waitlisted') {
    // Push this registration to waitlist
    const date = new Date();
    await pushToWaitlist(oldGeneric.serviceOccurrence.split('_')[1], oldGeneric._id, date, date);
  } else if (oldStatus !== newStatus) {
    throw new Error('Invalid registration status chosen.');
  }
}

const updateOccurrenceOccupancyOnServiceRegistrationDelete = async function (oldGeneric) {
  const statuses = await getIndividualsInClass(':RegistrationStatus');
  const status = statuses[oldGeneric.status];
  const occUri = oldGeneric.serviceOccurrence;
  if (!occUri)
    return;
  const occ = await GDBServiceOccurrenceModel.findOne({_uri: occUri}, {populates: ['characteristicOccurrences']});
  if (!occ)
    return;
  if (status === 'Registered') {
    // Pop one registration from waitlist, if any, and change its status to registered
    const registration = await popFromWaitlist(occ._id);
    if (!!registration) {
      const statuses = await getIndividualsInClass(':RegistrationStatus');
      const registeredStatus = Object.keys(statuses).find(status => statuses[status] === 'Registered');
      const statusC = PredefinedCharacteristics['Registration Status'];
      const statusCO = registration.characteristicOccurrences.find(co => co.occurrenceOf === statusC._uri);
      registration.status = registeredStatus;
      statusCO.dataStringValue = registeredStatus;
      await registration.save();
      // occ.occupancy doesn't change
    } else {
      const occupancyC = PredefinedCharacteristics['Occupancy'];
      const occupancyCO = occ.characteristicOccurrences.find(co => co.occurrenceOf === occupancyC._uri);
      occ.occupancy -= 1;
      occupancyCO.dataNumberValue -= 1;
      await occ.save();
    }
  } else if (status === 'Waitlisted') {
    // Remove this registration from waitlist
    await removeFromWaitlist(oldGeneric.serviceOccurrence.split('_')[1], oldGeneric._id);
  }
}

module.exports = {
  serviceRegistrationInternalTypeCreateTreater,
  serviceRegistrationInternalTypeFetchTreater,
  serviceRegistrationInternalTypeUpdateTreater,
  checkServiceOccurrenceUnchanged,
  updateOccurrenceOccupancyOnServiceRegistrationCreate,
  afterCreateServiceRegistration,
  updateOccurrenceOccupancyOnServiceRegistrationUpdate,
  updateOccurrenceOccupancyOnServiceRegistrationDelete,
}
