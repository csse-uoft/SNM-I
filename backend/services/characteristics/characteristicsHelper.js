const {GDBCharacteristicModel} = require("../../models/ClientFunctionalities/characteristic");
const {GDBOptionModel} = require("../../models/ClientFunctionalities/option");
const {GDBFieldTypeModel} = require("../../models/ClientFunctionalities/fieldType")

async function findCharacteristicById(id) {
  return await GDBCharacteristicModel.findOne(
    {_id: id},
    {populates: ['implementation.fieldType', 'implementation.options']}
  );
}

async function createCharacteristicHelper(data) {
  const {label, name, multipleValues, dataType, codes, fieldType, options, optionsFromClass, description} = data;
  const characteristic = GDBCharacteristicModel({
    description,
    name,
    codes,
  });


  if (label || dataType || fieldType || optionsFromClass || options) {
    characteristic.implementation = {
      label: label,
      options: options,
      valueDataType: dataType,
      optionsFromClass: optionsFromClass,
      fieldType: await GDBFieldTypeModel.findOne({type: fieldType}),
      multipleValues: multipleValues,
    }
  }

  await characteristic.save();
  return characteristic;
}

async function updateCharacteristicHelper(id, updateData) {
  const characteristic = await findCharacteristicById(id);
  const {label, name, multipleValues, dataType, fieldType, options, optionsFromClass, description} = updateData;

  //if implementation model is not defined and required in update, initiate here.
  if (!characteristic.implementation &&
    (label || dataType || fieldType || options || optionsFromClass)) {
    characteristic.implementation = {};
  }

  if (name) {
    characteristic.name = name;
  }

  if (description) {
    characteristic.description = description;
  }

  if (label) {
    characteristic.implementation.label = label;
  }

  if (multipleValues) {
    characteristic.implementation.multipleValues = multipleValues;
  }

  // dataType looks like [{label: '', value:''}, {label:'', value:''}]
  if (dataType) {
    characteristic.implementation.valueDataType = dataType;
  }

  if (fieldType) {
    //initiate fieldType model here if it is undefined.
    if (!characteristic.implementation.fieldType) {
      characteristic.implementation.fieldType = {};
    }
    characteristic.implementation.fieldType = await GDBFieldTypeModel.findOne({type: fieldType});
  }

  if (options) {
    characteristic.implementation.options = options;
  } else {
    let i;
    for (i = 0; i < characteristic.implementation.options.length; i++){
      const doc = await GDBOptionModel.findByIdAndDelete(characteristic.implementation.options[i]._id);
    }
    characteristic.implementation.options = [];
  }

  if (optionsFromClass) {
    characteristic.implementation.optionsFromClass = optionsFromClass;
  } else {
    characteristic.implementation.optionsFromClass = undefined;
  }

  await characteristic.save();
  return characteristic;

}

module.exports = {
  findCharacteristicById,
  updateCharacteristicHelper,
  createCharacteristicHelper,
}
