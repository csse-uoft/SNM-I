const {findClientById, createClientHelper, updateClientHelper} = require("./clientHelper");

const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBCharacteristicModel, GDBClientModel, GDBQOModel} = require("../../models");
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
  // Object.entries(data.fields).map((field, value) => {
  //
  //   const [fieldType, fieldId] = fieldParser(field)
  //   if(fieldType === 'characteristic'){
  //     characteristicIds.push(fieldId)
  //     characteristicValues.push(value)
  //   }else if(fieldType === 'question'){
  //     questionIds.push(fieldId)
  //     questionValues.push(value)
  //   }
  // })

  for (let field in data.fields) {
    const value = data.fields[field]
    const [fieldType, fieldId] = fieldParser(field)
    if(fieldType === 'characteristic'){
      characteristicIds.push(fieldId)
      characteristicValues.push(value)
    }else if(fieldType === 'question'){
      questionIds.push(fieldId)
      questionValues.push(value)
    }
  }
  const newClient = GDBClientModel({characteristicOccurrences: [], questionOccurrences: []})
  if(characteristicIds.length > 0){
    const characteristics = await GDBCharacteristicModel.find({_id: {$in: characteristicIds}}, {populates: ['implementation']})
    characteristics.forEach((characteristic, index) => {
      const newCO = GDBCOModel({occurrenceOf: characteristic})
      if(characteristic.implementation.valueDataType === 'xsd:string'){
        // TODO: check if the dataType of input value is correct
        newCO.dataStringValue = characteristicValues[index]
      }else if(characteristic.implementation.valueDataType === 'xsd:number'){
        newCO.dataNumberValue = characteristicValues[index]
      }else if(characteristic.implementation.valueDataType === 'xsd:boolean'){
        newCO.dataBooleanValue = characteristicValues[index]
      }else if(characteristic.implementation.valueDataType === 'xsd:datetimes'){
        newCO.dataDateValue = characteristicValues[index]
      }else if(characteristic.implementation.valueDataType === "owl:NamedIndividual"){
        newCO.objectValues = [... characteristicValues[index]]
      }
      newClient.characteristicOccurrences.push(newCO)
    })
  }
  if(questionIds.length > 0){
    const questions = await GDBQuestionModel.find({_id: {$in: questionIds}})
    questions.forEach((question, index) => {
      const newQO = GDBQOModel({occurrenceOf: question, stringValue: questionValues[index]})
      newClient.questionOccurrences.push(newQO)
    })
  }

  await newClient.save()


}


module.exports = {createClient, }