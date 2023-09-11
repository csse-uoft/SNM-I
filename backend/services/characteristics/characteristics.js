const {GDBCharacteristicModel} = require("../../models/ClientFunctionalities/characteristic");
const {
  findCharacteristicById, updateCharacteristicHelper,
  createCharacteristicHelper, updateOptions, updateFieldType
} = require("./characteristicsHelper");
const {SPARQL, GraphDB} = require('graphdb-utils');
const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBClientModel, GDBServiceProviderModel} = require("../../models");
const {query} = require("express");
const {getConnectedKindOfs} = require("../kindOf");

const option2Model = {
  'client': GDBClientModel,
  'serviceProvider': GDBServiceProviderModel,
}

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

  const {label, name, multipleValues, dataType, fieldType, options, optionsFromClass, description, kindOf} = req.body;
  const updateData = {
    label,
    name,
    multipleValues,
    dataType,
    fieldType,
    options,
    optionsFromClass,
    description,
    kindOf
  };

  try {

    const query = `
    PREFIX : <http://snmi#>
    select * where { 
	      ?s ?p :characteristic_${id}.
        ?s a :CharacteristicOccurrence.
    } limit 1`

    let isUsed = false
    await GraphDB.sendSelectQuery(query, false, () => {
      isUsed = true
    });

    const characteristic = await findCharacteristicById(id);
    const forms = await MDBDynamicFormModel.find({formStructure: {$elemMatch: {fields: {$elemMatch: {id: id, type: 'characteristic'}}}}})
    if(forms.length !== 0 || isUsed || characteristic.isPredefined)
      return res.status(400).json({success: false, message: 'This characteristic cannot be updated'})
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

    const query = `
    PREFIX : <http://snmi#>
    select * where { 
	      ?s ?p :characteristic_${id}.
        ?s a :CharacteristicOccurrence.
    } limit 1`

    let isUsed = false
    await GraphDB.sendSelectQuery(query, false, () => {
      isUsed = true
    });

    const fetchData = {
      name: characteristic.name,
      description: characteristic.description,
      codes: [],
      kindOf: characteristic.kindOf,
      label: characteristic.implementation.label,
      dataType: characteristic.implementation.valueDataType,
      fieldType: characteristic.implementation.fieldType.type,
      options: characteristic.implementation.options,
      optionsFromClass: characteristic.implementation.optionsFromClass,
    }
    return res.status(200).json({fetchData, success: true, locked: forms.length !== 0 || isUsed || characteristic.isPredefined});
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
      if (characteristic?.implementation?.options) {
        characteristic.implementation.options = characteristic.implementation.options
          .map(option => {
            option = option.toJSON();
            return {...option, iri: SPARQL.ensureFullURI(`:option_${option._id}`)};
          });
      }
      characteristic.id = characteristic._id;
      delete characteristic._id;
      return characteristic;
    })
    return res.status(200).json({data, success: true});
  } catch (e) {
    next(e)
  }
}

const deleteCharacteristic = async (req, res, next) => {
  try {
    const id = req.params.id;
    const characteristic = await findCharacteristicById(id);
    // check if the characteristic is used by a form
    const forms = await MDBDynamicFormModel.find({formStructure: {$elemMatch: {fields: {$elemMatch: {id: id, type: 'characteristic'}}}}})


    // check if the characteristic has an occurrence
    const query = `
    PREFIX : <http://snmi#>
    select * where { 
	      ?s ?p :characteristic_${id}.
        ?s a :CharacteristicOccurrence.
    } limit 1`

    let isUsed = false
    await GraphDB.sendSelectQuery(query, false, () => {
      isUsed = true
    });
    if(characteristic.isPredefined || forms.length !== 0 || isUsed)
      return res.status(400).json({success: false, message: 'The characteristic is not deletable'});
    const doc = await GDBCharacteristicModel.findByIdAndDelete(id);
    return res.status(200).json({success: true});
  } catch (e) {
    next(e)
  }
}


async function getConnectedCharacteristics(req, res, next) {
  return res.status(200).json({
    success: true,
    data: await getConnectedKindOfs(req.params.startNodeURI, ':characteristics', ':hasName')
  });
}



module.exports = {
  createCharacteristic, updateCharacteristic, fetchCharacteristic,
  fetchCharacteristics, deleteCharacteristic, fetchCharacteristicsWithDetails,
  getConnectedCharacteristics
}