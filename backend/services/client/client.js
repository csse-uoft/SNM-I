const {findClientById, createClientHelper, updateClientHelper} = require("./clientHelper");

const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBCharacteristicModel} = require("../../models");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {GDBCOModel} = require("../../models/ClientFunctionalities/characteristicOccurrence");

const fieldParser = (fieldName) => {
  const arr = fieldName.split('_')
  return arr
}

const createClient = async (req, res, next) => {
  const data = req.body;
  if(!data.formId){
    return res.status(400).json({success: false, message: 'No form Id is given'})
  }
  const form = await MDBDynamicFormModel.findById(data.formId)
  if(form.formType !== 'client'){
    return res.status(400).json({success: false, message: 'The form is not for client'})
  }
  if(!form.formStructure){
    return res.status(400).json({success: false, message: 'The form structure is undefined'})
  }
  // TODO: verify if questions and characteristics are in the form

  if(!data.fields){
    return res.status(400).json({success: false, message: 'Please provide the fields'})
  }
  const characteristicIds = []
  const characteristicValues = []
  const questionIds = []
  const questionValues = []
  Object.entries(data.fields).map((field, value) => {
    const [fieldType, fieldId] = fieldParser(field)
    if(fieldType === 'characteristic'){
      characteristicIds.push(fieldId)
      characteristicValues.push(value)
    }else if(fieldType === 'question'){
      questionIds.push(fieldId)
      questionValues.push(value)
    }
  })

  const characteristics = await GDBCharacteristicModel.find({_id: {$in: characteristicIds}})
  const questions = await GDBQuestionModel.find({_id: {$in: questionIds}})

  characteristics.forEach((characteristic, index) => {
    const newCO = GDBCOModel({occurrenceOf: characteristic})
    if(characteristic.implementation.valueDataType == 'xsd: string'){
      // TODO: check if the dataType of input value is correct
      newCO.dataStringValue = characteristicValues[index]
    }else if(characteristic.implementation.valueDataType == 'xsd: number'){
      newCO.dataNumberValue = characteristicValues[index]
    }else if(characteristic.implementation.valueDataType == 'xsd:boolean'){
      newCO.dataBooleanValue = characteristicValues[index]
    }else if(characteristic.implementation.valueDataType == 'xsd:datetimes'){
      newCO.dataDateValue = characteristicValues[index]
    }else if(characteristic.implementation.valueDataType == "owl:NamedIndividual"){
      newCO.objectValues = [... characteristicValues[index]]
    }
    newCO.save()
  })


  // if(!Array.isArray(data.questionOccurrences) || !Array.isArray(data.characteristicOccurrences)){
  //   return res.status(400).json({success: false, message: 'Wrong format on request body'})
  // }
  try {
    if(!data.id){
      await createClientHelper(data);
      return res.status(202).json({success: true, message: 'Successfully create a client.'});
    }else if(data.id){
      await updateClientHelper(data)
      return res.status(202).json({success: true, message: 'Successfully update the client'})
    }

  } catch (e) {
    next(e)
  }
}


module.exports = {createClient, }