const {findClientById, findOrganizationById, deleteHelper, parseHelper} = require("./clientHelper");

const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBClientModel, GDBQOModel, GDBOrganizationModel, GDBCharacteristicModel, GDBPhoneNumberModel} = require("../../models");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {GDBCOModel} = require("../../models/ClientFunctionalities/characteristicOccurrence");
const {SPARQL} = require('../../utils/graphdb/helpers');
const {FieldTypes} = require('../characteristics/misc');


const option2Model = {
  'client': GDBClientModel,
  'organization': GDBOrganizationModel,
}

const linkedProperty = (option, characteristic) => {
  const schema = option2Model[option].schema
  for (let key in schema) {
    if (schema[key].internalKey === characteristic.predefinedProperty)
      return key
  }
  return false
}

const parsePhoneNumber = (phone) => {
  const [_, countryCode, phoneNumber, areaCode] = phone.match(/\+(\d+)((?: \((\d+)\))? \d+\-\d+)/)
  return {countryCode: Number(countryCode), areaCode: Number(areaCode), phoneNumber: Number(phoneNumber.replace(/[() +-]/g, ''))}

}

const implementCharacteristicOccurrence = async (characteristic, occurrence, value) => {
  const {valueDataType, fieldType} = characteristic.implementation;
  if (characteristic.implementation.valueDataType === 'xsd:string') {
    // TODO: check if the dataType of input value is correct
    occurrence.dataStringValue = value + '';
  } else if (characteristic.implementation.valueDataType === 'xsd:number') {
    occurrence.dataNumberValue = Number(value);
  } else if (characteristic.implementation.valueDataType === 'xsd:boolean') {
    occurrence.dataBooleanValue = !!value.target.value;
  } else if (characteristic.implementation.valueDataType === 'xsd:datetimes') {
    occurrence.dataDateValue = new Date(value);
  } else if (characteristic.implementation.valueDataType === "owl:NamedIndividual") {

    if (fieldType === FieldTypes.SingleSelectField.individualName) {
      occurrence.objectValue = value;
    } else if (fieldType === FieldTypes.MultiSelectField.individualName) {
      console.assert(value instanceof Array);
      occurrence.multipleObjectValues = value;
    } else if (fieldType === FieldTypes.RadioSelectField.individualName) {
      occurrence.objectValue = value;
    } else if (fieldType === FieldTypes.PhoneNumberField.individualName) {
      const phoneNumber = GDBPhoneNumberModel(parsePhoneNumber(value));
      await phoneNumber.save()
      occurrence.objectValue = phoneNumber.individualName;
    } else if (fieldType === FieldTypes.AddressField.individualName) {
      occurrence.objectValue = value
    } else {
      throw Error(`Should not reach here. ${fieldType}`)
    }

  }
}

const createClientOrganization = async (req, res, next) => {
  const data = req.body;
  const {option} = req.params

  // check the data package from frontend
  if (!data.formId) {
    return res.status(400).json({success: false, message: 'No form Id is given'})
  }
  const form = await MDBDynamicFormModel.findById(data.formId)
  if (form.formType !== option) {
    return res.status(400).json({success: false, message: 'Invalid form type.'})
  }
  if (!form.formStructure) {
    return res.status(400).json({success: false, message: 'The form structure is undefined'})
  }
  // TODO: verify if questions and characteristics are in the form

  if (!data.fields) {
    return res.status(400).json({success: false, message: 'Please provide the fields'})
  }

  try {
    const questions = {};
    const characteristics = {};

    // Pick all characteristics and questions from package and put their ids into dictionary
    for (const key of Object.keys(data.fields)) {
      const [type, id] = key.split('_');
      if (type === 'characteristic') {
        characteristics[id] = null;
      } else if (type === 'question') {
        questions[id] = null;
      }
    }
    // Fetch characteristics & questions from database and put them into dictionary
    if (Object.keys(characteristics).length)
      (await GDBCharacteristicModel.find({_id: {$in: Object.keys(characteristics)}}, {populates: ['implementation']}))
        .forEach(item => characteristics[item._id] = item);
    if (Object.keys(questions).length)
      (await GDBQuestionModel.find({_id: {$in: Object.keys(questions)}}, {populates: ['implementation']}))
        .forEach(item => questions[item._id] = item);

    const instanceData = {characteristicOccurrences: [], questionOccurrences: []};
    for (const [key, value] of Object.entries(data.fields)) {
      const [type, id] = key.split('_');

      if (type === 'characteristic') {
        const characteristic = characteristics[id];
        const occurrence = {occurrenceOf: characteristic};


        if (characteristic.isPredefined) {
          const property = linkedProperty(option, characteristic)
          if (property)
            instanceData[property] = value
        }


        await implementCharacteristicOccurrence(characteristic, occurrence, value)

        instanceData.characteristicOccurrences.push(occurrence);

      } else if (type === 'question') {
        const occurrence = {occurrenceOf: questions[id], stringValue: value};
        instanceData.questionOccurrences.push(occurrence);
      }
    }

    await option2Model[option](instanceData).save();

    return res.status(202).json({success: true, message: 'Successfully created a ' + option});

  } catch (e) {
    next(e)
  }

}


const fetchClientsOrOrganizations = async (req, res, next) => {
  const {option} = req.params;
  try {
    const data = await option2Model[option].find({},
      {populates: ['characteristicOccurrences.occurrenceOf', 'questionOccurrence']});
    return res.status(200).json({data, success: true});

  } catch (e) {
    next(e)
  }
}

const deleteClientOrOrganization = async (req, res, next) => {
  try {
    const {option, id} = req.params;

    // TODO: use delete Helper check which form can be deleted.
    // await deleteHelper(option, id);

    const doc = await option2Model[option].findByIdAndDelete(id);
    return res.status(200).json({success: true});

  } catch (e) {
    next(e)
  }
}


module.exports = {
  createClientOrganization,
  fetchClientsOrOrganizations,
  deleteClientOrOrganization,
}