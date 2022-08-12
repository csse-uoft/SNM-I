const {findClientById, findOrganizationById, deleteHelper, parseHelper} = require("./clientHelper");

const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBClientModel, GDBQOModel, GDBOrganizationModel, GDBCharacteristicModel} = require("../../models");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {GDBCOModel} = require("../../models/ClientFunctionalities/characteristicOccurrence");


const option2Model = {
  'client': GDBClientModel,
  'organization': GDBOrganizationModel,
}

const createClientOrganization = async (req, res, next) => {
  const data = req.body;
  const {option} = req.params

  // check the data package from frontend
  if (!data.formId) {
    return res.status(400).json({success: false, message: 'No form Id is given'})
  }
  const form = await MDBDynamicFormModel.findById(data.formId)
  if (form.formType !== 'client' && option === 'client') {
    return res.status(400).json({success: false, message: 'The form is not for client'})
  }
  if (form.formType !== 'organization' && option === 'organization') {
    return res.status(400).json({success: false, message: 'The form is not for organization'})
  }
  if (!form.formStructure) {
    return res.status(400).json({success: false, message: 'The form structure is undefined'})
  }
  // TODO: verify if questions and characteristics are in the form

  if (!data.fields) {
    return res.status(400).json({success: false, message: 'Please provide the fields'})
  }

  try {
    const questions = {};
    const characteristics = {};

    // Pick all characteristics and questions from package and put their ids into dictionary
    for (const key of Object.keys(data.fields)) {
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

    const instanceData = {characteristicOccurrences: [], questionOccurrences: []};
    for (const [key, value] of Object.entries(data.fields)) {
      const [type, id] = key.split('_');

      if (type === 'characteristic') {
        const characteristic = characteristics[id];
        const occurrence = {occurrenceOf: characteristic};

        if(characteristic.isPredefined){
          if ((Object.keys(GDBClientModel.schema).filter((property) => {
            return property === characteristic.name
          })).length !== 0 && option === 'client'){
            instanceData[characteristic.name] = value
          }else if((Object.keys(GDBOrganizationModel.schema).filter((property) => {
            return property === characteristic.name
          })).length !== 0 && option === 'organization'){
            instanceData[characteristic.name] = value
          }
        }

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
          continue;
        }

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

const fetchClientOrOrganization = async (req, res, next) => {
  try {
    const data = req.body;
    const {option, id} = req.params;

    // if(!data.formId){
    //   return res.status(400).json({success: false, message: 'No form Id is given'})
    // }
    // const form = await MDBDynamicFormModel.findById(data.formId)
    // if(form.formType !== 'client' && option === 'client'){
    //   return res.status(400).json({success: false, message: 'The form is not for client'})
    // }
    // if(form.formType !== 'organization' && option === 'organization'){
    //   return res.status(400).json({success: false, message: 'The form is not for organization'})
    // }
    // if(!form.formStructure){
    //   return res.status(400).json({success: false, message: 'The form structure is undefined'})
    // }
    // const formStructure = form.formStructure
    //
    // for (let step in formStructure){
    //   for (let x in Object.keys(step.fields)){
    //
    //   }
    // }

    if (option === 'client') {
      const client = await findClientById(id);
      const displayAll = await parseHelper(client);
      return res.status(202).json({displayAll, success: true, message: 'Successfully fetched a client.'})
    }

    if (option === 'organization') {
      const organization = await findOrganizationById(id);
      return res.status(202).json({organization, success: true, message: 'Successfully fetched an organization.'})
    }

  } catch (e) {
    next(e)
  }
}

const fetchClientsOrOrganizations = async (req, res, next) => {
  const {option} = req.params;
  try {
    const data = await option2Model[option].find({},
      {populates: ['characteristicOccurrences.occurrenceOf', 'questionOccurrence']});
    return res.status(200).json({data, success: true});

  } catch (e) {
    next(e)
  }
}

const deleteClientOrOrganization = async (req, res, next) => {
  try {
    const {option, id} = req.params;

    // TODO: use delete Helper check which form can be deleted.
    // await deleteHelper(option, id);

    if (option === 'client') {
      const doc = await GDBClientModel.findByIdAndDelete(id);
      return res.status(200).json({success: true});
    }
    if (option === 'organization') {
      const doc = await GDBOrganizationModel.findByIdAndDelete(id);
      return res.status(200).json({success: true});
    }
  } catch (e) {
    next(e)
  }
}



module.exports = {
  createClientOrganization,
  fetchClientOrOrganization,
  fetchClientsOrOrganizations,
  deleteClientOrOrganization,
}