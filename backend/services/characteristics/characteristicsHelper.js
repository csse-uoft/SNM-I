const {GDBCharacteristicModel} = require("../../models/ClientFunctionalities/characteristic");
const {GDBOptionModel} = require("../../models/ClientFunctionalities/option");
const {GDBFieldTypeModel} = require("../../models/ClientFunctionalities/fieldType")

async function findCharacteristicById(id) {
  return await GDBCharacteristicModel.findOne(
    {_id: id},
    {populates: ['implementation.fieldType', 'implementation.options', 'implementation.dataType']}
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

  // if (fieldType){
  //   characteristic.implementation.fieldType = GDBFieldTypeModel({
  //     type: fieldType
  //   });
  // }

  // if (options.length > 0){
  //   for (let i = 0; i < options.length; i++) {
  //     const option = GDBOptionModel({label: options[i].label})
  //     characteristic.implementation.optionss.push(option);
  //   }
  // }

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
    characteristic.implementation.dataType.concat(dataType);
  }

  if (fieldType) {
    //initiate fieldType model here if it is undefined.
    if (!characteristic.implementation.fieldType) {
      characteristic.implementation.fieldType = {};
    }
    characteristic.implementation.fieldType.type = fieldType;
  }

  if (options) {
    characteristic.implementation.options = options;
  }

  if (optionsFromClass) {
    characteristic.implementation.optionsFromClass = optionsFromClass;
  }

  await characteristic.save();
  return characteristic;

}

// async function updateOptions(id, options) {
//   const characteristic = await findCharacteristicById(id);
//   characteristic.implementation.options.concat(options);
//
// }
//
// async function updateFieldType(id, fieldType) {
//   const characteristic = await findCharacteristicById(id);
//   characteristic.implementation.fieldType.type = fieldType;
// }

module.exports = {
  findCharacteristicById,
  updateCharacteristicHelper,
  createCharacteristicHelper,
}
