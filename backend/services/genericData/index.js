const {GDBClientModel, GDBOrganizationModel, GDBPhoneNumberModel, GDBCharacteristicModel, GDBAddressModel} = require("../../models");
const {SPARQL} = require('../../utils/graphdb/helpers');
const {FieldTypes} = require("../characteristics");
const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {characteristicRoute} = require("../../routes");
const {GraphDB} = require("../../utils/graphdb");

const option2Model = {
  'client': GDBClientModel,
  'organization': GDBOrganizationModel,
}

const linkedProperty = (option, characteristic) => {
  const schema = option2Model[option].schema
  for (let key in schema) {
    if (schema[key].internalKey === characteristic.predefinedProperty)
      return key
  }
  return false
}

const implementCharacteristicOccurrence = async (characteristic, occurrence, value) => {
  const {valueDataType, fieldType} = characteristic.implementation;
  if (characteristic.implementation.valueDataType === 'xsd:string') {
    // TODO: check if the dataType of input value is correct
    occurrence.dataStringValue = value + '';
  } else if (characteristic.implementation.valueDataType === 'xsd:number') {
    occurrence.dataNumberValue = Number(value);
  } else if (characteristic.implementation.valueDataType === 'xsd:boolean') {
    occurrence.dataBooleanValue = !!value.target.value;
  } else if (characteristic.implementation.valueDataType === 'xsd:datetimes') {
    occurrence.dataDateValue = new Date(value);
  } else if (characteristic.implementation.valueDataType === "owl:NamedIndividual") {

    if (fieldType === FieldTypes.SingleSelectField.individualName) {
      occurrence.objectValue = value;
    } else if (fieldType === FieldTypes.MultiSelectField.individualName) {
      console.assert(value instanceof Array);
      occurrence.multipleObjectValues = value;
    } else if (fieldType === FieldTypes.RadioSelectField.individualName) {
      occurrence.objectValue = value;
    } else if (fieldType === FieldTypes.PhoneNumberField.individualName) {
      const phoneNumber = GDBPhoneNumberModel(parsePhoneNumber(value));
      await phoneNumber.save()
      occurrence.objectValue = phoneNumber.individualName;
    } else if (fieldType === FieldTypes.AddressField.individualName) {
      const address = GDBAddressModel(value)
      await address.save()
      occurrence.objectValue = address.individualName

    } else {
      throw Error(`Should not reach here. ${fieldType}`)
    }

  }
}

const parsePhoneNumber = (phone) => {
  const [_, countryCode, phoneNumber, areaCode] = phone.match(/\+(\d+)((?: \((\d+)\))? \d+\-\d+)/)
  return {
    countryCode: Number(countryCode),
    areaCode: areaCode ? Number(areaCode) : undefined,
    phoneNumber: Number(phoneNumber.replace(/[() +-]/g, ''))
  }
}

const fetchCharacteristicAndQuestionsBasedOnFields = async (characteristics, questions, fields) => {
  for (const key of Object.keys(fields)) {
    const [type, id] = key.split('_');
    if (type === 'characteristic') {
      characteristics[id] = null;
    } else if (type === 'question') {
      questions[id] = null;
    }
  }
  // Fetch characteristics & questions from database and put them into dictionary
  if (Object.keys(characteristics).length)
    (await GDBCharacteristicModel.find({_id: {$in: Object.keys(characteristics)}}, {populates: ['implementation']}))
      .forEach(item => characteristics[item._id] = item);
  if (Object.keys(questions).length)
    (await GDBQuestionModel.find({_id: {$in: Object.keys(questions)}}, {populates: ['implementation']}))
      .forEach(item => questions[item._id] = item);
}

const combinePhoneNumber = ({countryCode, phoneNumber, areaCode}) => {
  let ret = ''
  if (areaCode) {
    ret = '+' + countryCode + ' (' + phoneNumber.toString().slice(0, 3) + ') ' +
      phoneNumber.toString().slice(3, 6) + '-' + phoneNumber.toString().slice(6)
  } else {
    ret = '+' + countryCode + ' ' + phoneNumber.toString().slice(0, 2) + '-' + phoneNumber.toString().slice(2)
  }
  return ret
}

async function fetchSingleGeneric(req, res, next) {
  const {option, id} = req.params;

  if (!option2Model[option])
    return res.status(400).json({success: false, message: 'Invalid generic type.'});

  const data = await option2Model[option].findOne({_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrences']});
  // TODO: model.populate("characteristicOccurrences.occurrenceOf.implementation")

  const result = {};

  // Copy the values to occurrence.value regardless of its type.
  if (data.characteristicOccurrences)
    for (const co of data.characteristicOccurrences) {

      // Assign full URI
      if (co.objectValue) {
        // when object is a phoneNumber
        await co.populate('occurrenceOf.implementation')
        if (co.occurrenceOf.implementation.fieldType === FieldTypes.PhoneNumberField.individualName) {
          const id = co.objectValue.split('_')[1]
          co.objectValue = combinePhoneNumber(await GDBPhoneNumberModel.findOne({_id: id}))
        } else if (co.occurrenceOf.implementation.fieldType === FieldTypes.AddressField.individualName) {

        } else {
          co.objectValue = SPARQL.getFullURI(co.objectValue);
        }

      } else if (co.multipleObjectValues) {
        co.multipleObjectValues = co.multipleObjectValues.map(value => SPARQL.getFullURI(value));
      }

      result[co.occurrenceOf.individualName ? co.occurrenceOf.individualName.replace(':', '') : co.occurrenceOf.replace(':', '')] =
        co.dataStringValue ?? co.dataNumberValue ?? co.dataBooleanValue ?? co.dataDateValue
        ?? co.objectValue ?? co.multipleObjectValues;
    }

  if (data.questionOccurrences)
    for (const qo of data.questionOccurrences) {
      result[qo.occurrenceOf.replace(':', '')] = qo.stringValue;
    }

  return res.status(200).json({data: result, success: true});
}

const createSingleGeneric = async (req, res, next) => {
  const data = req.body;
  const {option} = req.params

  // check the data package from frontend
  if (!data.formId) {
    return res.status(400).json({success: false, message: 'No form id is given'})
  }
  const form = await MDBDynamicFormModel.findById(data.formId)

  for (let key of Object.keys(option2Model)) {
    if (form.formType !== key && option === key) {
      return res.status(400).json({success: false, message: `The form is not for ${key}`})
    }
  }
  if (!form.formStructure) {
    return res.status(400).json({success: false, message: 'The form structure is not defined'})
  }
  // TODO: verify if questions and characteristics are in the form

  if (!data.fields) {
    return res.status(400).json({success: false, message: 'Please provide the fields'})
  }

  try {
    const questions = {};
    const characteristics = {};

    // // Pick all characteristics and questions from package and put their ids into dictionary
    // for (const key of Object.keys(data.fields)) {
    //   const [type, id] = key.split('_');
    //   if (type === 'characteristic') {
    //     characteristics[id] = null;
    //   } else if (type === 'question') {
    //     questions[id] = null;
    //   }
    // }
    // // Fetch characteristics & questions from database and put them into dictionary
    // if (Object.keys(characteristics).length)
    //   (await GDBCharacteristicModel.find({_id: {$in: Object.keys(characteristics)}}, {populates: ['implementation']}))
    //     .forEach(item => characteristics[item._id] = item);
    // if (Object.keys(questions).length)
    //   (await GDBQuestionModel.find({_id: {$in: Object.keys(questions)}}, {populates: ['implementation']}))
    //     .forEach(item => questions[item._id] = item);

    await fetchCharacteristicAndQuestionsBasedOnFields(characteristics, questions, data.fields)

    const instanceData = {characteristicOccurrences: [], questionOccurrences: []};
    for (const [key, value] of Object.entries(data.fields)) {
      const [type, id] = key.split('_');

      if (type === 'characteristic') {
        const characteristic = characteristics[id];
        const occurrence = {occurrenceOf: characteristic};


        if (characteristic.isPredefined) {
          const property = linkedProperty(option, characteristic)
          if (property)
            instanceData[property] = value
        }


        await implementCharacteristicOccurrence(characteristic, occurrence, value)

        instanceData.characteristicOccurrences.push(occurrence);

      } else if (type === 'question') {
        const occurrence = {occurrenceOf: questions[id], stringValue: value};
        instanceData.questionOccurrences.push(occurrence);
      }
    }

    await option2Model[option](instanceData).save();

    if (option === 'client') {
      return res.status(202).json({success: true, message: 'Successfully created a client'})
    } else if (option === 'organization') {
      return res.status(202).json({success: true, message: 'Successfully created an organization'})
    }

  } catch (e) {
    next(e)
  }

}

async function updateSingleGeneric(req, res, next) {
  const data = req.body
  const {id, option} = req.params


  try {
    // check the data package from frontend
    if (!id) {
      return res.status(400).json({success: false, message: 'No generic id is given'})
    }
    const generic = await option2Model[option].findOne({_id: id}, {
      populates: ['characteristicOccurrences',
        'questionOccurrences']
    })
    if (!generic) {
      return res.status(400).json({success: false, message: 'No such generic'})
    }
    if (!data.formId) {
      return res.status(400).json({success: false, message: 'No form id is given'})
    }
    const form = await MDBDynamicFormModel.findById(data.formId)
    for (let key of Object.keys(option2Model)) {
      if (form.formType !== key && option === key) {
        return res.status(400).json({success: false, message: `The form is not for ${key}`})
      }
    }
    if (!form.formStructure) {
      return res.status(400).json({success: false, message: 'The form structure is not defined'})
    }
    // TODO: verify if questions and characteristics are in the form
    if (!data.fields) {
      return res.status(400).json({success: false, message: 'Please provide the fields'})
    }


    const questions = {};
    const characteristics = {};
    await fetchCharacteristicAndQuestionsBasedOnFields(characteristics, questions, data.fields)


    for (const [key, value] of Object.entries(data.fields)) {
      const [type, id] = key.split('_')
      if (type === 'characteristic') {
        // find out all possible COs related to this characteristic
        let query = `
        PREFIX : <http://snmi#>
        select * where { 
	          ?co ?p :characteristic_${id}.
            ?co a :CharacteristicOccurrence.
        }`
        const possibleCharacteristicOccurrencesIds = []
        await GraphDB.sendSelectQuery(query, false, ({co, p}) => {
          possibleCharacteristicOccurrencesIds.push(co.value.split('_')[1])
        });
        // check if there is a CO in possibleCharacteristicOccurrencesIds is related to this generic
        const existedCO = generic.characteristicOccurrences.filter((co)=>{
          return possibleCharacteristicOccurrencesIds.filter((id) => {
            return id === co.individualName.split('_')[1]
          }).length > 0
        })[0]

        const characteristic = characteristics[id]
        if (characteristic.isPredefined) {
          const property = linkedProperty(option, characteristic)
          if (property)
            generic[property] = value
        }
        if(!existedCO){ // have to create a new CO
          const occurrence = {occurrenceOf: characteristic};
          await implementCharacteristicOccurrence(characteristic, occurrence, value)
          generic.characteristicOccurrences.push(occurrence)
        }else{ // just add the value on existedCO
          await implementCharacteristicOccurrence(characteristic, existedCO, value)
        }

      }

      if (type === 'question'){
        // find out all possible QOs related to this question
        let query = `
        PREFIX : <http://snmi#>
        select * where { 
	          ?qo ?p :question_${id}.
            ?qo a :QuestionOccurrence.
        }`
        const possibleQuestionOccurrencesIds = []
        await GraphDB.sendSelectQuery(query, false, ({qo, p}) => {
          possibleQuestionOccurrencesIds.push(qo.value.split('_')[1])
        });
        // check if there is a QO in possibleQuestionOccurrencesIds is related to this generic
        const existedQO = generic.questionOccurrences.filter((qo) => {
          return possibleQuestionOccurrencesIds.filter((id) => {
            return id === qo.individualName.split('_')[1]
          }).length > 0
        })[0]

        if(!existedQO){ // create a new QO
          const occurrence = {occurrenceOf: questions[id], stringValue: value};
          generic.questionOccurrences.push(occurrence);
        }else{
          existedQO.stringValue = value
        }

      }
    }

    await generic.save();
    res.json({success: true});

  } catch (e) {
    console.log(e)
  }

}


module.exports = {
  fetchSingleGeneric, createSingleGeneric, updateSingleGeneric
}