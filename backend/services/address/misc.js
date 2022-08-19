const {GDBSchemaCountry, GDBSchemaState, GDBStreetType, GDBStreetDirection} = require('../../models/address');
const {GDBFieldTypeModel} = require("../../models");


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

