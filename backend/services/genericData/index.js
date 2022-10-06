const {GDBClientModel, GDBServiceProviderModel, GDBPhoneNumberModel, GDBCharacteristicModel, GDBAddressModel, GDBQOModel} = require("../../models");
const {SPARQL} = require('../../utils/graphdb/helpers');
const {FieldTypes} = require("../characteristics");
const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {GraphDB} = require("../../utils/graphdb");
const {GDBNoteModel} = require("../../models/ClientFunctionalities/note");
const {GDBCOModel} = require("../../models/ClientFunctionalities/characteristicOccurrence");
const {MDBUsageModel} = require("../../models/usage");
const {parsePhoneNumber, combinePhoneNumber} = require("../../helpers/phoneNumber");
const {GDBServiceModel} = require("../../models/service/service");
const {GDBProgramModel} = require("../../models/program");
const {Server400Error} = require("../../utils");
const {GDBOrganizationModel} = require("../../models/organization");
const {GDBVolunteerModel} = require("../../models/volunteer");
const {GDBAppointmentModel} = require("../../models/appointment");

const genericType2Model = {
  'client': GDBClientModel,
  'organization': GDBOrganizationModel,
  'volunteer': GDBVolunteerModel,
  'service': GDBServiceModel,
  'program': GDBProgramModel,
  'appointment': GDBAppointmentModel,
}

const specialField2Model = {
  'address': GDBAddressModel,
  'phoneNumber': GDBPhoneNumberModel
}

// help to detect the time
const TIMEPATTERN = /^\d\d:\d\d:\d\d$/

const linkedProperty = (genericType, characteristic) => {
  const schema = genericType2Model[genericType].schema
  for (let key in schema) {
    if (schema[key].internalKey === characteristic.predefinedProperty)
      return key
  }
  return false
}

/**
 * This function saves one characteristic occurrence.
 * @param characteristic
 * @param occurrence
 * @param value
 * @returns {Promise<void>}
 */
const implementCharacteristicOccurrence = async (characteristic, occurrence, value) => {
  const {valueDataType, fieldType} = characteristic.implementation;

  // Storing value in the characteristic occurrence model.
  if (characteristic.implementation.valueDataType === 'xsd:string') {
    occurrence.dataStringValue = value + '';
  } else if (characteristic.implementation.valueDataType === 'xsd:number') {
    occurrence.dataNumberValue = Number(value);
  } else if (characteristic.implementation.valueDataType === 'xsd:boolean') {
    occurrence.dataBooleanValue = !!value;
  } else if (characteristic.implementation.valueDataType === 'xsd:datetimes') {
    if(TIMEPATTERN.test(value)){
      value = '1970-01-01 '+ value // when the field is time field, add 1970 to make it be able to stored into the database
    }
    occurrence.dataDateValue = new Date(value);
  } else if (characteristic.implementation.valueDataType === "owl:NamedIndividual") {
    if (fieldType === FieldTypes.SingleSelectField.individualName) {
      occurrence.objectValue = value;
    } else if (fieldType === FieldTypes.MultiSelectField.individualName) {
      occurrence.multipleObjectValues = value;
    } else if (fieldType === FieldTypes.RadioSelectField.individualName) {
      occurrence.objectValue = value;
    } else if (fieldType === FieldTypes.PhoneNumberField.individualName) {
      if(occurrence.objectValue){
        const [_, phoneNumberId] = occurrence.objectValue.split('_')
        await GDBPhoneNumberModel.findByIdAndDelete(phoneNumberId)
      }
      const phoneNumber = GDBPhoneNumberModel(parsePhoneNumber(value));
      // save phoneNumber since it is stored in a separate model.
      await phoneNumber.save()
      occurrence.objectValue = phoneNumber.individualName;
    } else if (fieldType === FieldTypes.AddressField.individualName) {
      if(occurrence.objectValue){
        const [_, addressId] = occurrence.objectValue.split('_')
        await GDBAddressModel.findByIdAndDelete(addressId)
      }
      const address = GDBAddressModel(value)
      // save address since it is stored in a separate model.
      await address.save()
      occurrence.objectValue = address.individualName

    } else {
      throw Error(`Should not reach here. ${fieldType}`)
    }

  }
}



const fetchCharacteristicAndQuestionsBasedOnForms = async (characteristics, questions, fields) => {
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

async function fetchSingleGenericHelper(genericType, id) {

  if (!genericType2Model[genericType]) {
    throw new Server400Error('Invalid generic type.')
    // return res.status(400).json({success: false, message: 'Invalid generic type.'});
  }

  const data = await genericType2Model[genericType].findOne({_id: id},
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
          const id = co.objectValue.split('_')[1];
          const address = (await GDBAddressModel.findOne({_id: id})).toJSON();

          // Get full URI
          if (address.streetType) address.streetType = SPARQL.getFullURI(address.streetType);
          if (address.streetDirection) address.streetDirection = SPARQL.getFullURI(address.streetDirection);
          if (address.state) address.state = SPARQL.getFullURI(address.state);

          co.objectValue = address;

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

  return result
}

async function fetchSingleGeneric(req, res, next) {
  try {
    const {genericType, id} = req.params;

    const result = await fetchSingleGenericHelper(genericType, id);
    if (result)
      return res.status(200).json({data: result, success: true});
  } catch (e) {
    next(e);
  }
}

async function addIdToUsage(option, genericType, id){
  let usage = await MDBUsageModel.findOne({option: option, genericType: genericType})
  if(!usage)
    usage = new MDBUsageModel({option: option, genericType: genericType, optionKeys: []})
  // check whether the characteristic linked to this option
  if(!usage.optionKeys.includes(id))
    usage.optionKeys.push(id)
  await usage.save()
}


async function deleteIdFromUsageAfterChecking(option, genericType, id){
  // check if this option's occurrence is linked with another instance of the genericType
  const key = option + 'Occurrences'
  const value = ':' + option + "_" + id
  const x = await genericType2Model[genericType].find({[key]: {occurrenceOf: value}})
  if(x.length === 0){
    // then we have to remove the id from the usage
    const usage = await MDBUsageModel.findOne({option: option, genericType: genericType})
    usage.optionKeys = usage.optionKeys.filter((key) => (key !== id))
    await usage.save()
  }

}

const createSingleGenericHelper = async (data, genericType) => {
  // check the data package from frontend
  // check if a formId was sent
  if (!data.formId) {
    throw new Server400Error('No form id is given')
    // return res.status(400).json({success: false, message: 'No form id is given'})
  }
  const form = await MDBDynamicFormModel.findById(data.formId)

  // check if the genericType is in genericType2Model
  if(!genericType2Model[genericType])
    throw new Server400Error('Invalid genericType')
  // return res.status(400).json({success: false, message: 'Invalid genericType'})

  // check if the form type is consist with request type(client, serviceProvider, ...)
  if(form.formType !== genericType)
    throw new Server400Error(`The form is not for ${genericType}`)
  // return res.status(400).json({success: false, message: `The form is not for ${genericType}`})

  // check if the form has a structure
  if (!form.formStructure) {
    throw new Server400Error('The form structure is not defined')
    // return res.status(400).json({success: false, message: 'The form structure is not defined'})
  }
  // TODO: verify if questions and characteristics are in the form

  // check if the fields are provided
  if (!data.fields) {
    throw new Server400Error('No fields provided')
    // return res.status(400).json({success: false, message: 'No fields provided'})
  }


  const questions = {};
  const characteristics = {};

  // extract questions and characteristics based on fields from the database
  await fetchCharacteristicAndQuestionsBasedOnForms(characteristics, questions, data.fields)

  const instanceData = {characteristicOccurrences: [], questionOccurrences: []};
  // iterating over all fields and create occurrences and store them into instanceData
  for (const [key, value] of Object.entries(data.fields)) {
    if(!value)
      continue;
    const [type, id] = key.split('_');

    if (type === 'characteristic') {
      const characteristic = characteristics[id];
      const occurrence = {occurrenceOf: characteristic};
      await implementCharacteristicOccurrence(characteristic, occurrence, value)

      // find the usage(given option and geneticType), create a new one if no such
      await addIdToUsage('characteristic', genericType, id)

      if (characteristic.isPredefined) {
        const property = linkedProperty(genericType, characteristic)
        if (property) {
          instanceData[property] = occurrence.dataStringValue ?? occurrence.dataNumberValue ?? occurrence.dataBooleanValue ??
            occurrence.dataDateValue ?? occurrence.objectValue;
          instanceData[property + 's'] = occurrence.multipleObjectValue
        }
      }

      instanceData.characteristicOccurrences.push(occurrence);

    } else if (type === 'question') {
      await addIdToUsage('question', genericType, id)
      const occurrence = {occurrenceOf: questions[id], stringValue: value};
      instanceData.questionOccurrences.push(occurrence);
    }
  }

  return instanceData

}

const createSingleGeneric = async (req, res, next) => {
  const data = req.body;
  // genericType will be 'client', 'serviceProvider',...
  const {genericType} = req.params

  try {

    const instanceData = await createSingleGenericHelper(data, genericType)
    if(instanceData){
      // the instance data is stored into graphdb
      await genericType2Model[genericType](instanceData).save();
      return res.status(202).json({success: true, message: `Successfully created a/an ${genericType}`})
    }

  } catch (e) {
    next(e)
  }

}

async function updateSingleGenericHelper(genericId, data, genericType) {
  const generic = await genericType2Model[genericType].findOne({_id: genericId}, {
    populates: ['characteristicOccurrences',
      'questionOccurrences']
  })
  if (!generic) {
    throw new Server400Error(`No such ${genericType}`);
  }
  if (!data.formId) {
    throw new Server400Error('No form id was provided');
  }
  const form = await MDBDynamicFormModel.findById(data.formId)
  for (let key of Object.keys(genericType2Model)) {
    if (form.formType !== key && genericType === key) {
      throw new Server400Error(`The form is not for ${key}`);
    }
  }
  if (!form.formStructure) {
    throw new Server400Error('The form structure is not defined')
  }
  // TODO: verify if questions and characteristics are in the form
  if (!data.fields) {
    throw new Server400Error('No fields provided');
  }

  // fetch characteristics and questions from GDB
  const questions = {};
  const characteristics = {};
  await fetchCharacteristicAndQuestionsBasedOnForms(characteristics, questions, data.fields)

  // check should we update or create a characteristicOccurrence or questionOccurrence
  // in other words, is there a characteristicOccurrence/questionOccurrence belong to this user,
  // and related to the characteristic/question
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
      if(!generic.characteristicOccurrences)
        generic.characteristicOccurrences = []
      const existedCO = generic.characteristicOccurrences.filter((co)=>{
        return possibleCharacteristicOccurrencesIds.filter((id) => {
          return id === co._id
        }).length > 0
      })[0]


      const characteristic = characteristics[id]

      if(!existedCO && value){ // have to create a new CO and add the characteristic's id to the usage
        await addIdToUsage('characteristic', genericType, id)
        const occurrence = {occurrenceOf: characteristic};
        await implementCharacteristicOccurrence(characteristic, occurrence, value)
        generic.characteristicOccurrences.push(occurrence)
        // update the generic's property if needed
        if (characteristic.isPredefined) {
          const property = linkedProperty(genericType, characteristic)
          if (property){
            generic[property] = occurrence.dataStringValue ?? occurrence.dataNumberValue ?? occurrence.dataBooleanValue ?? occurrence.dataDateValue
              ?? occurrence.objectValue;
            if(occurrence.multipleObjectValue)
              generic[property + 's'] = occurrence.multipleObjectValue
          }
        }
      }else if(existedCO && value){ // just add the value on existedCO
        await implementCharacteristicOccurrence(characteristic, existedCO, value)
        if (characteristic.isPredefined) {
          const property = linkedProperty(genericType, characteristic)
          if (property){
            generic[property] = existedCO.dataStringValue ?? existedCO.dataNumberValue ?? existedCO.dataBooleanValue ?? existedCO.dataDateValue ??
              existedCO.objectValue
            if(existedCO.multipleObjectValue)
              generic[property + 's'] = existedCO.multipleObjectValue

          }
        }
      }else if(existedCO && !value){ // when the user wants to remove the occurrence
        await existedCO.populate('occurrenceOf');
        if(existedCO.objectValue) { // remove the objectValue if necessary
          const [fieldType, id] = existedCO.objectValue.split('_');
          await specialField2Model[fieldType]?.findByIdAndDelete(id);
        }
        await GDBCOModel.findByIdAndDelete(existedCO._id); // remove the occurrence
        // also have to remove from usage if necessary
        await deleteIdFromUsageAfterChecking('characteristic', genericType, existedCO.occurrenceOf._id)
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
      if(!generic.questionOccurrences)
        generic.questionOccurrences = []
      const existedQO = generic.questionOccurrences.filter((qo) => {
        return possibleQuestionOccurrencesIds.filter((id) => {
          return id === qo._id
        }).length > 0
      })[0]

      if(!existedQO && value){ // create a new QO
        await addIdToUsage('question', genericType, id)
        const occurrence = {occurrenceOf: questions[id], stringValue: value};
        generic.questionOccurrences.push(occurrence);
      }else if(existedQO && value){ // update the question
        existedQO.stringValue = value
      }else if(existedQO && !value) { // remove the occurrence
        await GDBQOModel.findByIdAndDelete(existedQO._id);
        await existedQO.populate('occurrenceOf');
        await deleteIdFromUsageAfterChecking('question', genericType, existedQO.occurrenceOf._id);
      }

    }
  }
  return generic;
}

// what should we do if the field is empty
async function updateSingleGeneric(req, res, next) {
  const data = req.body
  const {id, genericType} = req.params

  try {
    // check the data package from frontend
    // checking if a generic id is provided
    if (!id) {
      return res.status(400).json({success: false, message: `No ${genericType} id is given`})
    }
    await (await updateSingleGenericHelper(id, data, genericType)).save();
    res.status(200).json({success: true});

  } catch (e) {
    next(e)
  }

}

async function deleteSingleGenericHelper(genericType, id){
  if(!genericType || !id)
    throw new Server400Error('genericType or id is not given');

  const generic = await genericType2Model[genericType].findOne({_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrences']})
  if(!generic)
    throw new Server400Error('Invalid genericType or id');

  const characteristicsOccurrences = generic.characteristicOccurrences
  const questionsOccurrences = generic.questionOccurrences
  const note = generic.note
  // delete notes
  await GDBNoteModel.findByIdAndDelete(note?._id)

  // recursively delete characteristicsOccurrences, including phoneNumber and Address
  // todo: other special fields
  if(characteristicsOccurrences){
    for (let characteristicOccurrence of characteristicsOccurrences) {
      await characteristicOccurrence.populate('occurrenceOf')
      if (characteristicOccurrence.objectValue) {
        const [fieldType, id] = characteristicOccurrence.objectValue.split('_');
        await specialField2Model[fieldType]?.findByIdAndDelete(id);
      }
      await GDBCOModel.findByIdAndDelete(characteristicOccurrence._id);
      await deleteIdFromUsageAfterChecking('characteristic', genericType, characteristicOccurrence.occurrenceOf._id);
    }
  }

  // recursively delete questionOccurrences
  if(questionsOccurrences){
    for (let questionOccurrence of questionsOccurrences) {
      await GDBQOModel.findByIdAndDelete(questionOccurrence._id);
      await questionOccurrence.populate('occurrenceOf');
      await deleteIdFromUsageAfterChecking('question', genericType, questionOccurrence.occurrenceOf._id);
    }
  }
  await genericType2Model[genericType].findByIdAndDelete(id);
}

async function deleteSingleGeneric(req, res, next){
  try{
    // check the package from frontend
    const {genericType, id} = req.params;
    await deleteSingleGenericHelper(genericType, id);

    return res.status(200).json({success: true})


  }catch (e) {
    next(e)
  }
}

const fetchGenericDatas = async (req, res, next) => {
  const {genericType} = req.params;
  try {
    const data = await genericType2Model[genericType].find({},
      {populates: ['characteristicOccurrences.occurrenceOf', 'questionOccurrence']});

    return res.status(200).json({data, success: true});

  } catch (e) {
    next(e)
  }
}



module.exports = {
  fetchSingleGeneric, createSingleGeneric, updateSingleGeneric, deleteSingleGeneric, fetchGenericDatas,
  createSingleGenericHelper, fetchSingleGenericHelper, deleteSingleGenericHelper, updateSingleGenericHelper
}