const {MDBDynamicFormModel} = require('../../models/dynamicForm');
const {GDBUserAccountModel} = require('../../models/userAccount')
const {GraphDB} = require("../../utils/graphdb");
const {SPARQL} = require('../../utils/graphdb/helpers');

async function createDynamicForm(req, res, next) {
  // TODO: implement forOrganization
  const {name, formType, forOrganization, formStructure} = req.body;
  const modifiedAt = new Date();

  // Get current user IRI
  const currentUser = await GDBUserAccountModel.findOne({primaryEmail: req.session.email});
  const createdBy = currentUser.individualName;

  try {
    const form = new MDBDynamicFormModel({
      name, formType, formStructure, createdBy, modifiedAt
    });

    await form.save();
    res.json({success: true});
  } catch (e) {
    next(e);
  }
}

async function updateDynamicForm(req, res, next) {
  const {name, formType, formStructure} = req.body;
  const {id} = req.params;

  const form = await MDBDynamicFormModel.findById(id);
  form.name = name;
  form.formType = formType;
  form.formStructure = formStructure;
  form.modifiedAt = new Date();

  await form.save();
  res.json({success: true});
}

async function deleteDynamicForm(req, res, next) {
  const {id} = req.params;
  await MDBDynamicFormModel.deleteOne({_id: id});
  res.json({success: true});
}

async function getDynamicForm(req, res, next) {
  const {id} = req.params;
  const form = await MDBDynamicFormModel.findById(id);
  res.json({
    success: true,
    form
  });
}

async function getAllDynamicForms(req, res, next) {
  const forms = await MDBDynamicFormModel.find({}, 'formType forOrganization createdBy modifiedAt name');
  res.json({
    success: true,
    forms
  });
}

async function getDynamicFormsByFormType(req, res, next) {
  const forms = await MDBDynamicFormModel.find({formType: req.params.formType}, 'forOrganization createdBy modifiedAt name');
  res.json({
    success: true,
    forms
  });
}


async function getIndividualsInClass(req, res) {
  const instances = {};

  const query = `
    PREFIX : <http://snmi#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX cids: <http://ontology.eil.utoronto.ca/cids/cids#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    select * 
    where { 
        ?s a <${SPARQL.getFullURI(req.params.class)}>, owl:NamedIndividual.
        OPTIONAL {?s rdfs:label ?label .}
        FILTER (isIRI(?s))
    }`;
  console.log(query)

  await GraphDB.sendSelectQuery(query, false, ({s, label}) => {
    instances[s.id] = label?.value || s.id;
  });
  res.json(instances);
}

module.exports = {
  createDynamicForm, getAllDynamicForms, getDynamicForm, deleteDynamicForm, updateDynamicForm, getDynamicFormsByFormType,
  getIndividualsInClass
}