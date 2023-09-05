const {FieldTypes} = require("../characteristics");
const {GDBPhoneNumberModel, GDBAddressModel, GDBCharacteristicModel} = require("../../models");
const {parsePhoneNumber} = require("../../helpers/phoneNumber");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");

// help to detect the time
const TIMEPATTERN = /^\d\d:\d\d:\d\d$/;
/**
 * This function saves one characteristic occurrence.
 * @param characteristic
 * @param occurrence
 * @param value
 * @returns {Promise<void>}
 */
const implementCharacteristicOccurrence = async (characteristic, occurrence, value) => {
  const {valueDataType, fieldType} = characteristic.implementation;
  const prefixedDataType = SPARQL.ensurePrefixedURI(characteristic.implementation.valueDataType);
  // Storing value in the characteristic occurrence model.
  if (prefixedDataType === 'xsd:string') {
    occurrence.dataStringValue = value + '';
  } else if (prefixedDataType === 'xsd:number') {
    occurrence.dataNumberValue = Number(value);
  } else if (prefixedDataType === 'xsd:boolean') {
    occurrence.dataBooleanValue = !!value;
  } else if (prefixedDataType === 'xsd:datetimes') {
    if (TIMEPATTERN.test(value)) {
      value = '1970-01-01 ' + value; // when the field is time field, add 1970 to make it be able to stored into the database
    }
    occurrence.dataDateValue = new Date(value);
  } else if (prefixedDataType === "owl:NamedIndividual") {
    const prefixedFieldType = SPARQL.ensurePrefixedURI(fieldType);

    if (prefixedFieldType === FieldTypes.SingleSelectField.individualName) {
      occurrence.objectValue = value;
    } else if (prefixedFieldType === FieldTypes.MultiSelectField.individualName) {
      occurrence.multipleObjectValues = value;
    } else if (prefixedFieldType === FieldTypes.RadioSelectField.individualName) {
      occurrence.objectValue = value;
    } else if (prefixedFieldType === FieldTypes.PhoneNumberField.individualName) {
      if (occurrence.objectValue) {
        const [_, phoneNumberId] = occurrence.objectValue.split('_');
        await GDBPhoneNumberModel.findByIdAndDelete(phoneNumberId);
      }
      const phoneNumber = GDBPhoneNumberModel(parsePhoneNumber(value));
      // save phoneNumber since it is stored in a separate model.
      await phoneNumber.save();
      occurrence.objectValue = phoneNumber._uri;
    } else if (prefixedFieldType === FieldTypes.AddressField.individualName) {
      if (occurrence.objectValue) {
        const [_, addressId] = occurrence.objectValue.split('_');
        await GDBAddressModel.findByIdAndDelete(addressId);
      }
      if (value._id) delete value._id;
      const address = GDBAddressModel(value);
      // save address since it is stored in a separate model.
      await address.save();
      occurrence.objectValue = address._uri;

    } else {
      throw Error(`Should not reach here. ${fieldType}`);
    }

  }
};

const fetchCharacteristicQuestionsInternalTypesBasedOnForms = async (characteristics, questions, internalTypes, fields) => {
  for (const key of Object.keys(fields)) {
    const [type, id] = key.split('_');
    if (type === 'characteristic') {
      characteristics[id] = null;
    } else if (type === 'question') {
      questions[id] = null;
    } else if (type === 'internalType') {
      internalTypes[id] = null;
    }
  }
  // Fetch characteristics & questions from database and put them into dictionary
  if (Object.keys(characteristics).length)
    (await GDBCharacteristicModel.find({_id: {$in: Object.keys(characteristics)}}, {populates: ['implementation']}))
      .forEach(item => characteristics[item._id] = item);
  if (Object.keys(questions).length)
    (await GDBQuestionModel.find({_id: {$in: Object.keys(questions)}}, {populates: ['implementation']}))
      .forEach(item => questions[item._id] = item);
  if (Object.keys(internalTypes).length)
    (await GDBInternalTypeModel.find({_id: {$in: Object.keys(internalTypes)}}, {populates: ['implementation']}))
      .forEach(item => internalTypes[item._id] = item);
};

function getPredefinedProperty(genericType, characteristic) {
  const {genericType2Model} = require('./index');
  const schema = genericType2Model[genericType].schema;
  for (let key in schema) {
    if (SPARQL.ensureFullURI(schema[key].internalKey) === characteristic.predefinedProperty)
      return key;
  }
  return false;
}

async function getInternalTypeValues(properties, doc, FORMTYPE) {
  const result = {};
  const schema = doc.schema;

  for (const property of properties) {
    if (doc[property] != null) {
      const internalType = await GDBInternalTypeModel.findOne({
        predefinedProperty: schema[property].internalKey,
        formType: FORMTYPE
      });
      if (Array.isArray(doc[property])) {
        result['internalType_' + internalType._id] = doc[property].map(SPARQL.ensureFullURI);
      } else {
        result['internalType_' + internalType._id] = SPARQL.ensureFullURI(doc[property]);
      }
    }
  }
  return result;
}

module.exports = {
  fetchCharacteristicQuestionsInternalTypesBasedOnForms, implementCharacteristicOccurrence,
  getPredefinedProperty, getInternalTypeValues
}