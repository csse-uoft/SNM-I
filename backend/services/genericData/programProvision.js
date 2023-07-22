const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");
const {GDBClientModel} = require("../../models/ClientFunctionalities/client");
const {GDBProgramModel} = require("../../models/program/program");
const {GDBProgramOccurrenceModel} = require("../../models/program/programOccurrence");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");


const FORMTYPE = 'programProvision'

const programProvisionInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'needOccurrence' || property === 'programOccurrence') {
    instanceData[property] = value;
  }
  if (internalType.name === 'needSatisfierForProgramProvision') {
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

const programProvisionInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema = data.schema;

  if (data.needOccurrence) {
    // Add client
    const client = await GDBClientModel.findOne({needOccurrence: data.needOccurrence});
    const internalType = await GDBInternalTypeModel.findOne({
      name: 'clientForProgramProvision',
      formType: FORMTYPE
    });
    result['internalType_' + internalType._id] = SPARQL.getFullURI(client.individualName);
  }
  if (data.programOccurrence) {
    // Add program
    const id = data.programOccurrence.split('_')[1];
    const programOcc = await GDBProgramOccurrenceModel.findById(id);
    const internalType = await GDBInternalTypeModel.findOne({
      name: 'programForProgramProvision',
      formType: FORMTYPE
    });
    result['internalType_' + internalType._id] = SPARQL.getFullURI(programOcc.occurrenceOf);
  }

  if (data.needSatisfierOccurrence) {
    // Add need satisfier
    const id = data.needSatisfierOccurrence.split('_')[1];
    const needSatisfierOcc = await GDBNeedSatisfierOccurrenceModel.findById(id);
    const internalType = await GDBInternalTypeModel.findOne({
      name: 'needSatisfierForProgramProvision',
      formType: FORMTYPE
    });
    result['internalType_' + internalType._id] = SPARQL.getFullURI(needSatisfierOcc.occurrenceOf);
  }

  for (const property in data) {
    if (property === 'needOccurrence' || property === 'programOccurrence' || property === 'needSatisfierOccurrence') {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema[property].internalKey,
        formType: FORMTYPE
      });
      result['internalType_' + internalType._id] = SPARQL.getFullURI(data[property]);
    }
  }
  return result;
};

const programProvisionInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programProvisionInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {
  programProvisionInternalTypeCreateTreater,
  programProvisionInternalTypeFetchTreater,
  programProvisionInternalTypeUpdateTreater
}
