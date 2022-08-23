const {GDBOrganizationModel, GDBCharacteristicModel, GDBQOModel} = require("../../models");
const {GDBCOModel} = require("../../models/ClientFunctionalities/characteristicOccurrence");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");

const fieldParser = (fieldName) => {
  return fieldName.split('_');
}

async function findOrganizationById(id) {
  return await GDBOrganizationModel.findOne(
    {_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrence']}
  );
}

async function createOrganizationHelper(data) {
  const organization = GDBOrganizationModel({characteristicOccurrences: [], questionOccurrences: []});

  const characteristicIds = []
  const characteristicValues = []
  const questionIds = []
  const questionValues = []

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
      organization.characteristicOccurrences.push(newCO)
    })
  }
  if(questionIds.length > 0){
    const questions = await GDBQuestionModel.find({_id: {$in: questionIds}})
    questions.forEach((question, index) => {
      const newQO = GDBQOModel({occurrenceOf: question.name, stringValue: questionValues[index]})
      organization.questionOccurrences.push(newQO)
    })
  }

  await organization.save();
  return organization;
}

async function updateOrganizationHelper(data) {
  const {questionOccurrences, characteristicOccurrences, organizationId} = data;
  const organization = await findOrganizationById(organizationId);

}


module.exports = {findOrganizationById, createOrganizationHelper, updateOrganizationHelper}