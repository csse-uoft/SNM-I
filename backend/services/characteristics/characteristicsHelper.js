import {GDBCharacteristicModel} from "../../models";


async function findCharacteristicById(id) {
  return await GDBCharacteristicModel.findOne(
    {_id: id}, {populates: ['implementation.fieldType', 'implementation.options']}
  );
}

async function updateCharacteristicHelper(id, updateData) {
  const characteristic = await findCharacteristicById(id);
  const {label, dataType, fieldType, option, required, optionsFromClass, description} = updateData;

  //if implementation model is not defined and required in update, initiate here.
  if(!characteristic.implementation &&
    (label || dataType || fieldType || option || required ||optionsFromClass)){
    characteristic.implementation = {};
  }

  if(label) {
    characteristic.implementation.options
  }

  // dataType looks like [{label: '', value:''}, {label:'', value:''}]
  if(dataType){
    //TODO: add update
  }

  if(fieldType) {
    //initiate fieldType model here if it is undefined.
    if(!characteristic.implementation.fieldType){
      characteristic.implementation.fieldType = {};
    }
    characteristic.implementation.fieldType.type = fieldType;
  }

  //option looks like []
  if(option) {
    //TODO: add update
  }

  if(required) {
    characteristic.implementation.required = required;
  }

  if(optionsFromClass){
    //TODO: add update
  }

  if(description){
    characteristic.description = description;
  }

  await characteristic.save();
  return characteristic;

}

module.exports = {findCharacteristicById, updateCharacteristicHelper}
