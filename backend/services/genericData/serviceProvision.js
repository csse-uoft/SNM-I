const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const {GDBClientModel} = require("../../models/ClientFunctionalities/client");
const {GDBServiceModel} = require("../../models/service/service");
const {GDBServiceOccurrenceModel} = require("../../models/service/serviceOccurrence");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");


const FORMTYPE = 'serviceProvision'

const serviceProvisionInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'needOccurrence' || property === 'serviceOccurrence') {
    instanceData[property] = value;
  }
  if (internalType.name === 'needSatisfierForServiceProvision') {
    if (value) {
      instanceData.needSatisfierOccurrence = {
        occurrenceOf: value,
        startDate: instanceData.startDate,
        endDate: instanceData.endDate,
      };
    } else {
      const _id = instanceData.needSatisfierOccurrence._id;

      // TODO: Verify if the occurrence is deleted
      if (_id) {
        await GDBNeedSatisfierOccurrenceModel.findByIdAndDelete(_id);
      }
      delete instanceData.needSatisfierOccurrence;
    }

  }
};

const serviceProvisionInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;

  if (data.needOccurrence) {
    // Add client
    const client = await GDBClientModel.findOne({needOccurrence: data.needOccurrence});
    const internalType = await GDBInternalTypeModel.findOne({
      name: 'clientForServiceProvision',
      formType: FORMTYPE
    });
    result['internalType_' + internalType._id] = SPARQL.ensureFullURI(client.individualName);
  }
  if (data.serviceOccurrence) {
    // Add service
    const id = data.serviceOccurrence.split('_')[1];
    const serviceOcc = await GDBServiceOccurrenceModel.findById(id);
    const internalType = await GDBInternalTypeModel.findOne({
      name: 'serviceForServiceProvision',
      formType: FORMTYPE
    });
    result['internalType_' + internalType._id] = SPARQL.ensureFullURI(serviceOcc.occurrenceOf);
  }

  if (data.needSatisfierOccurrence) {
    // Add need satisfier
    const id = data.needSatisfierOccurrence.split('_')[1];
    const needSatisfierOcc = await GDBNeedSatisfierOccurrenceModel.findById(id);
    const internalType = await GDBInternalTypeModel.findOne({
      name: 'needSatisfierForServiceProvision',
      formType: FORMTYPE
    });
    result['internalType_' + internalType._id] = SPARQL.ensureFullURI(needSatisfierOcc.occurrenceOf);
  }

  for (const property in data) {
    if (property === 'needOccurrence' || property === 'serviceOccurrence' || property === 'needSatisfierOccurrence') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema[property].internalKey,
        formType: FORMTYPE
      });
      result['internalType_' + internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};

const serviceProvisionInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceProvisionInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {
  serviceProvisionInternalTypeCreateTreater,
  serviceProvisionInternalTypeFetchTreater,
  serviceProvisionInternalTypeUpdateTreater
}