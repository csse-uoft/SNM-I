const {GDBCharacteristicModel} = require("../../models/ClientFunctionalities/characteristic");
const {
  findCharacteristicById, updateCharacteristicHelper,
  createCharacteristicHelper, updateOptions, updateFieldType
} = require("./characteristicsHelper");
const {SPARQL} = require('../../utils/graphdb/helpers');
const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBClientModel} = require("../../models");


const createCharacteristic = async (req, res, next) => {
  const {label, name, codes, multipleValues, dataType, fieldType, options, optionsFromClass, description} = req.body;
  const data = {
    label,
    name,
    codes,
    multipleValues,
    dataType,
    fieldType,
    options,
    optionsFromClass,
    description,
  };

  try {
    await createCharacteristicHelper(data);
    return res.status(202).json({success: true, message: 'Successfully update characteristics.'});
  } catch (e) {
    next(e)
  }

}

const updateCharacteristic = async (req, res, next) => {
  const id = req.params.id;

  const {label, name, multipleValues, dataType, fieldType, options, optionsFromClass, description} = req.body;
  const updateData = {
    label,
    name,
    multipleValues,
    dataType,
    fieldType,
    options,
    optionsFromClass,
    description,
  };

  try {
    const forms = await MDBDynamicFormModel.find({formStructure: {$elemMatch: {fields: {$elemMatch: {id: id, type: 'characteristic'}}}}})
    if(forms.length !== 0)
      res.status(400).json({success: false, message: 'This characteristic cannot be updated'})
    await updateCharacteristicHelper(id, updateData);
    return res.status(202).json({success: true, message: 'Successfully update characteristics.'});
  } catch (e) {
    next(e)
  }

}

const fetchCharacteristic = async (req, res, next) => {
  try {
    const id = req.params.id;
    const characteristic = await findCharacteristicById(id);
    const forms = await MDBDynamicFormModel.find({formStructure: {$elemMatch: {fields: {$elemMatch: {id: id, type: 'characteristic'}}}}})
    const clients = await GDBClientModel.find({characteristicOccurrence: {occurrenceOf: {_id: id}}}, {populates: ['characteristicOccurrence']})

    if (characteristic.implementation?.optionsFromClass) {
      characteristic.implementation.optionsFromClass = SPARQL.getFullURI(characteristic.implementation.optionsFromClass);
    }

    const fetchData = {
      name: characteristic.name,
      description: characteristic.description,
      codes: [],
      label: characteristic.implementation.label,
      dataType: characteristic.implementation.valueDataType,
      fieldType: characteristic.implementation.fieldType.type,
      options: characteristic.implementation.options,
      optionsFromClass: characteristic.implementation.optionsFromClass,

    }
    return res.status(200).json({fetchData, success: true,locked: forms.length !== 0});
  } catch (e) {
    next(e)
  }
}

const fetchCharacteristicsWithDetails = async (req, res, next) => {
  try {
    const data = await GDBCharacteristicModel.find({},
      {populates: ['implementation', 'implementation.options']});
    await data.populate('implementation');
    return res.status(200).json({data, success: true});
  } catch (e) {
    next(e)
  }
}

const fetchCharacteristics = async (req, res, next) => {
  try {
    const rawData = await GDBCharacteristicModel.find({},
      {populates: ['implementation.fieldType', 'implementation.options']});
    const data = rawData.map((characteristic) => {
      return {
        id: characteristic._id,
        name: characteristic.name,
        description: characteristic.description,
        codes: characteristic.codes,
        implementation: characteristic.implementation,
      }
    })
    return res.status(200).json({data, success: true});
  } catch (e) {
    next(e)
  }
}

const deleteCharacteristic = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await GDBCharacteristicModel.findByIdAndDelete(id);
    return res.status(200).json({success: true});
  } catch (e) {
    next(e)
  }
}


module.exports = {
  createCharacteristic, updateCharacteristic, fetchCharacteristic,
  fetchCharacteristics, deleteCharacteristic, fetchCharacteristicsWithDetails
}