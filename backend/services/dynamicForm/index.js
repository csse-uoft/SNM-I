const {MDBDynamicFormModel} = require('../../models/dynamicForm');
const {GDBUserAccountModel} = require('../../models/userAccount')
const {GraphDB, SPARQL, sortObjectByKey} = require("graphdb-utils");
const {Server400Error} = require('../../utils');

// this object contains checkers for different type of generics
const field2Checker = {
  service: haveNoQuestionChecker,
  serviceOccurrence: haveNoQuestionChecker,
  program: haveNoQuestionChecker,
  programOccurrence: haveNoQuestionChecker,
}


function haveNoQuestionChecker(formStructure) {
  formStructure.map(step => {
    step.fields.map(field => {
      if (field.type === 'question')
        throw new Server400Error('Wrong information fields')
    })
  })
}

async function createDynamicForm(req, res, next) {
  // TODO: implement forOrganization
  const {name, formType, forOrganization, formStructure} = req.body;
  const modifiedAt = new Date();

  // Get current user IRI
  const currentUser = await GDBUserAccountModel.findOne({primaryEmail: req.session.email});
  const createdBy = currentUser.individualName;

  try {
    if (field2Checker[formType])
      field2Checker[formType](formStructure);
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

async function getFormsWithUserInfo(forms) {
  const userIds = forms.map(form => form.createdBy.split("_").slice(-1)[0]);
  if (userIds.length === 0) {
    return forms;
  }
  const users = await GDBUserAccountModel.find({_id: {$in: userIds}}, {populates: ['primaryContact']})
  const userId2UserInstance = new Map();
  for (const user of users) {
    userId2UserInstance.set(user._id, user);
  }

  const formsObject = [];
  for (const form of forms) {
    const user = userId2UserInstance.get(form.createdBy.split("_").slice(-1)[0]);
    if (!user) {
      // user is deleted
      formsObject.push({
        ...form.toJSON(),
        createdBy: {
          displayName: 'Deleted Account',
        }
      });
    } else {
      formsObject.push({
        ...form.toJSON(),
        createdBy: {
          primaryEmail: user.primaryEmail,
          displayName: user.displayName,
          familyName: user.primaryContact.familyName,
          givenName: user.primaryContact.givenName,
        }
      })
    }
  }
  return formsObject;
}

async function getAllDynamicForms(req, res, next) {
  const forms = await MDBDynamicFormModel.find({}, 'formType forOrganization createdBy modifiedAt name');

  const formsWithUserInfo = await getFormsWithUserInfo(forms);

  res.json({
    success: true,
    forms: formsWithUserInfo
  });
}

async function getDynamicFormsByFormTypeHelper(formType) {
  const forms = await MDBDynamicFormModel.find({formType}, 'forOrganization createdBy modifiedAt name');

  const formsWithUserInfo = await getFormsWithUserInfo(forms);
  return formsWithUserInfo;
}

async function getDynamicFormsByFormType(req, res, next) {
  const formsWithUserInfo = await getDynamicFormsByFormTypeHelper(req.params.formType);

  res.json({
    success: true,
    forms: formsWithUserInfo
  });
}


async function getIndividualsInClass(className) {
  const instances = {};
  const fullURI = SPARQL.ensureFullURI(className) ;

  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select * 
    where { 
        ?s a <${fullURI}>, owl:NamedIndividual.
        OPTIONAL {
            ?s rdfs:label ?labelEn .
            FILTER(LANGMATCHES(LANG(?labelEn), "en"))
        }
        OPTIONAL {
            ?s rdfs:label ?labelFr .
            FILTER(LANGMATCHES(LANG(?labelFr), "fr"))
        }
        OPTIONAL {
            ?s rdfs:label ?label .
            FILTER(LANGMATCHES(LANG(?label), ""))
        }
        OPTIONAL {?s :hasOrganization [tove_org:hasName ?name] .} # For Service Provider: organization
        OPTIONAL {?s :hasVolunteer [foaf:familyName ?lastName] .} # For Service Provider: volunteer 
        OPTIONAL {?s foaf:familyName ?familyName. ?s foaf:givenName ?givenName. } # For Person/Client
        OPTIONAL {?s :hasType ?type . } # for needSatisfier
        OPTIONAL {?s tove_org:hasName ?toveHasName . } # for tove_org:hasName property
        OPTIONAL {?s :hasPrimaryEmail ?primaryEmail . } # for :hasPrimaryEmail property
        FILTER (isIRI(?s))
    }`;

  // todo: volunteer will only give last name
  await GraphDB.sendSelectQuery(query, false, ({s, label, labelEn, labelFr, name, familyName, givenName, type, lastName, toveHasName, primaryEmail}) => {
    if (labelEn?.value || labelFr?.value || label?.value || name?.value || (familyName?.value || givenName?.value) || type?.value || lastName?.value || toveHasName?.value || primaryEmail?.value) {
      instances[s.id] = labelEn?.value || labelFr?.value || label?.value || name?.value || lastName?.value || type?.value || toveHasName?.value || primaryEmail?.value || `${familyName?.value || ''}, ${givenName?.value || ''}`;
    } else {
      instances[s.id] = SPARQL.ensurePrefixedURI(s.id) || s.id;
    }
  });
  return instances;
}


async function getIndividualsInClassHandler(req, res) {
  res.json(sortObjectByKey(await getIndividualsInClass(req.params.class)));
}

async function getURILabel(req, res) {
  const fullURI = SPARQL.ensureFullURI(req.params.uri) ;
  const query = `
    ${SPARQL.getSPARQLPrefixes()}
    select * 
    where { 
        BIND (<${fullURI}> as ?s).
        OPTIONAL {
            ?s rdfs:label ?labelEn .
            FILTER(LANGMATCHES(LANG(?labelEn), "en"))
        }
        OPTIONAL {
            ?s rdfs:label ?labelFr .
            FILTER(LANGMATCHES(LANG(?labelFr), "fr"))
        }
        OPTIONAL {
            ?s rdfs:label ?label .
            FILTER(LANGMATCHES(LANG(?label), ""))
        }
        OPTIONAL {?s :hasLabel ?label2 .}
        OPTIONAL {?s :hasOrganization [tove_org:hasName ?name] .} # For Service Provider: organization
        OPTIONAL {?s :hasVolunteer [foaf:familyName ?lastName] .} # For Service Provider: volunteer 
        OPTIONAL {?s foaf:familyName ?familyName. ?s foaf:givenName ?givenName. } # For Person/Client
        OPTIONAL {?s :hasType ?type . } # for needSatisfier
        OPTIONAL {?s tove_org:hasName ?toveHasName . } # for tove_org:hasName property
        OPTIONAL {?s :hasPrimaryEmail ?primaryEmail . } # for :hasPrimaryEmail property
        FILTER (isIRI(?s))
    }`;

  let result = ''
  await GraphDB.sendSelectQuery(query, false, ({s, label, labelEn, labelFr, label2, name, familyName, givenName, type, lastName, toveHasName, primaryEmail}) => {
    if (labelEn?.value || labelFr?.value || label?.value || label2?.value || name?.value || (familyName?.value || givenName?.value) || type?.value || lastName?.value || toveHasName?.value || primaryEmail?.value) {
      result = labelEn?.value || labelFr?.value || label?.value || label2?.value || name?.value || lastName?.value || type?.value || toveHasName?.value || primaryEmail?.value || `${familyName?.value || ''}, ${givenName?.value || ''}`;
    } else {
      result = SPARQL.ensurePrefixedURI(s.id) || s.id;
    }
  });
  res.json({label: result});
}

module.exports = {
  createDynamicForm, getAllDynamicForms, getDynamicForm, deleteDynamicForm, updateDynamicForm, getDynamicFormsByFormType,
  getIndividualsInClass, getIndividualsInClassHandler, getURILabel, getDynamicFormsByFormTypeHelper
}
