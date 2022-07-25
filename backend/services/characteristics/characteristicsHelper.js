const {GDBCharacteristicModel} = require("../../models/ClientFunctionalities/characteristic");
const {GDBOptionModel} = require("../../models/ClientFunctionalities/option");
const {GDBFieldTypeModel} = require("../../models/ClientFunctionalities/fieldType")

async function findCharacteristicById(id) {
  return await GDBCharacteristicModel.findOne(
    {_id: id}, {populates: ['implementation.fieldType', 'implementation.options']}
  );
}

async function createCharacteristicHelper(data){
  const {label, name, dataType, codes, fieldType, options, optionsFromClass, description} = data;
  const characteristic = GDBCharacteristicModel({
    description,
    name,
    codes,
  });


  if (label || dataType || fieldType || options || name ||optionsFromClass){
    characteristic.implementation = {
      label: label,
      valueDataType: dataType,
      options: options,
      optionsFromClass : optionsFromClass,
    }
  }

  if (fieldType){
    characteristic.implementation.fieldType = GDBFieldTypeModel({
      type: fieldType
    });
  }

  if (options){
    for (const {value, label} of Object.values(options)) {
      const option = GDBOptionModel({value, label})
      characteristic.implementation.options.append(option);
    }
  }

  await characteristic.save();
  return characteristic;
}

async function updateCharacteristicHelper(id, updateData) {
  const characteristic = await findCharacteristicById(id);
  const {label, name, dataType, fieldType, options, optionsFromClass, description} = updateData;

  //if implementation model is not defined and required in update, initiate here.
  if(!characteristic.implementation &&
    (label || dataType || fieldType || options || name ||optionsFromClass)){
    characteristic.implementation = {};
  }

  if(label) {
    characteristic.implementation.label = label;
  }

  if(name) {
    characteristic.implementation.name = name;
  }

  // dataType looks like [{label: '', value:''}, {label:'', value:''}]
  if(dataType){
    characteristic.implementation.dataType.concat(dataType);
  }

  if(fieldType) {
    //initiate fieldType model here if it is undefined.
    if(!characteristic.implementation.fieldType){
      characteristic.implementation.fieldType = {};
    }
    characteristic.implementation.fieldType.type = fieldType;
  }

  if(optionsFromClass){
    characteristic.implementation.optionsFromClass = optionsFromClass;
  }

  if (name) {
    characteristic.name = name;
  }

  if(description){
    characteristic.description = description;
  }

  await characteristic.save();
  return characteristic;

}

async function updateOptions(id, options) {
  const characteristic = await findCharacteristicById(id);
  characteristic.implementation.options.concat(options);

}

async function updateFieldType(id, fieldType) {
  const characteristic = await findCharacteristicById(id);
  characteristic.implementation.fieldType.type = fieldType;
}

module.exports = {
  findCharacteristicById,
  updateCharacteristicHelper,
  createCharacteristicHelper,
  updateOptions,
  updateFieldType,
}
