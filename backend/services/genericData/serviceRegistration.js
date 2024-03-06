const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const {GDBServiceOccurrenceModel} = require("../../models/service/serviceOccurrence");
const {getIndividualsInClass} = require("../dynamicForm");
const {PredefinedCharacteristics, PredefinedInternalTypes} = require("../characteristics");

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
  if (!occUri) return;
  const occ = await GDBServiceOccurrenceModel.findOne({_uri: occUri});
  if (status === 'Registered') {
    if (!occ.capacity || (occ.occupancy < occ.capacity)) {
      occ.occupancy += 1;
      occ.save();
    } else {
      throw new Error('The requested service occurrence is now at capacity. Please refresh the form to review your current options.');
    }
  } else if (status === 'Waitlisted') {
    // TODO
  }
}

const checkServiceOccurrenceUnchanged = async function (instanceData, internalTypes, fields, oldGeneric) {
  const newOccUri = fields['internalType_' + PredefinedInternalTypes['serviceOccurrenceForServiceRegistration']._id];
  const oldOccUri = oldGeneric.serviceOccurrence;
  if (newOccUri !== oldOccUri)
    throw new Error('A service registration\'s service occurrence cannot change.');
}

const updateOccurrenceOccupancyOnServiceRegistrationUpdate = async function (instanceData, internalTypes, fields, oldGeneric) {
  // checkServiceOccurrenceUnchanged must be called before this
  const statuses = await getIndividualsInClass(':RegistrationStatus');
  const oldStatus = statuses[oldGeneric.status];
  const newStatus = statuses[fields[`characteristic_${PredefinedCharacteristics['Registration Status']._id}`]];
  const occUri = fields['internalType_' + PredefinedInternalTypes['serviceOccurrenceForServiceRegistration']._id];
  if (!occUri) return;
  const occ = await GDBServiceOccurrenceModel.findOne({_uri: occUri});
  if (oldStatus === 'Not Registered' && newStatus === 'Registered') {
    if (!occ.capacity || (occ.occupancy < occ.capacity)) {
      occ.occupancy += 1;
      occ.save();
    } else {
      throw new Error('The requested service occurrence is now at capacity. Please refresh the form to review your current options.');
    }
  } else if (oldStatus === 'Registered' && newStatus === 'Not Registered') {
    occ.occupancy -= 1;
    occ.save();
  } else if (oldStatus === 'Waitlisted' && newStatus === 'Not Registered') { // TODO
  } else if (oldStatus === 'Not Registered' && newStatus === 'Waitlisted') { // TODO
  } else {
    throw new Error('Invalid registration status chosen.');
  }
}

const updateOccurrenceOccupancyOnServiceRegistrationDelete = async function (oldGeneric) {
  const statuses = await getIndividualsInClass(':RegistrationStatus');
  const status = statuses[oldGeneric.status];
  const occUri = oldGeneric.serviceOccurrence;
  if (!occUri) return;
  const occ = await GDBServiceOccurrenceModel.findOne({_uri: occUri});
  if (status === 'Registered') {
    occ.occupancy -= 1;
    occ.save();
  } else if (status === 'Waitlisted') { // TODO
  }
}

module.exports = {
  serviceRegistrationInternalTypeCreateTreater,
  serviceRegistrationInternalTypeFetchTreater,
  serviceRegistrationInternalTypeUpdateTreater,
  checkServiceOccurrenceUnchanged,
  updateOccurrenceOccupancyOnServiceRegistrationCreate,
  updateOccurrenceOccupancyOnServiceRegistrationUpdate,
  updateOccurrenceOccupancyOnServiceRegistrationDelete,
}
