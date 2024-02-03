const {GDBSchemaCountry, GDBSchemaState, GDBStreetType, GDBStreetDirection} = require('../../models/address');
const {GDBFieldTypeModel} = require("../../models");
const { getIndividualsInClass } = require('../dynamicForm');

var streetTypeOptions = null;
var streetDirectionOptions = null;
var stateOptions = null;

async function getAddressOptions() {
  streetTypeOptions = await getIndividualsInClass('ic:StreetType');
  streetDirectionOptions = await getIndividualsInClass('ic:StreetDirection');
  stateOptions = await getIndividualsInClass('schema:State');
}

async function convertAddressForSerialization(address) {
  if (!streetTypeOptions || !streetDirectionOptions || !stateOptions) {
    await getAddressOptions();
  }

  if (address.streetType)
    address.streetType = streetTypeOptions[address.streetType];      
  if (address.streetDirection)
    address.streetDirection = streetDirectionOptions[address.streetDirection];
  if (address.state)
    address.state = stateOptions[address.state];

  return address;
}

async function convertAddressForDeserialization(address) {
  if (!streetTypeOptions || !streetDirectionOptions || !stateOptions) {
    await getAddressOptions();
  }

  if (address.streetType)
    address.streetType = Object.keys(streetTypeOptions).find(option => streetTypeOptions[option] === address.streetType);
  if (address.streetDirection)
    address.streetDirection = Object.keys(streetDirectionOptions).find(option => streetDirectionOptions[option] === address.streetDirection);
  if (address.state)
    address.state = Object.keys(stateOptions).find(option => stateOptions[option] === address.state);

  if (address._uri)
    delete address._uri;
  if (address._id)
    delete address._id;

  return address;
}

/**
 *
 * Init FieldTypes.
 * @returns {Promise<void>}
 */
async function initAddress() {
  const newFieldTypes = {...type2Label};
  const fieldTypes = await GDBFieldTypeModel.find({});
  for (const fieldType of fieldTypes) {
    if (Object.keys(type2Label).includes(fieldType.type)) {
      fieldType.label = type2Label[fieldType.type];
      // This won't be triggered if label is unchanged.
      await fieldType.save();
      delete newFieldTypes[fieldType.type];

      // Cache it
      fieldTypeCache[fieldType.type] = fieldType;
    }
  }

  // Create new field types
  for (const [type, label] of Object.entries(newFieldTypes)) {
    const newFieldType = new GDBFieldTypeModel({type, label});
    await newFieldType.save();

    // Cache it
    fieldTypeCache[newFieldType.type] = newFieldType;
  }
}

module.exports = {convertAddressForSerialization, convertAddressForDeserialization}