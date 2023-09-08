const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GraphDB, SPARQL} = require("graphdb-utils");

const formFormatChecker = (form) => {
  return (!form || !form.type || !form.description || !form.characteristics ||
    !(Array.isArray(form.characteristics) || form.characteristics.length === 0)) // todo: need to add codes checker
}

const createNeedSatisfier = async (req, res, next) => {
  const form = req.body;
  // fetch characteristic and replace it into the form
  if (formFormatChecker(form))
    return res.status(400).json({success: false, message: 'Wrong information format'})
  try {
    const needSatisfier = GDBNeedSatisfierModel(form);
    await needSatisfier.save();
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const fetchNeedSatisfiers = async (req, res, next) => {
  try {
    const needSatisfiers = await GDBNeedSatisfierModel.find({});
    return res.status(200).json({success: true, needSatisfiers});
  } catch (e) {
    next(e);
  }
};

const deleteNeedSatisfier = async (req, res, next) => {
  const {id} = req.params;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  try {
    await GDBNeedSatisfierModel.findByIdAndDelete(id);
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const fetchNeedSatisfier = async (req, res, next) => {
  const {id} = req.params;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  try {
    const needSatisfier = await GDBNeedSatisfierModel.findOne({_id: id}, {populates: ['characteristics']})
    return res.status(200).json({success: true, needSatisfier});
  } catch (e) {
    next(e);
  }

};

const updateNeedSatisfier = async (req, res, next) => {
  const {id} = req.params;
  const form = req.body;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  if (formFormatChecker(form))
    return res.status(400).json({success: false, message: 'Wrong information format'});
  try {
    const needSatisfier = await GDBNeedSatisfierModel.findById(id);
    needSatisfier.type = form.type;
    needSatisfier.codes = form.codes;
    needSatisfier.description = form.description;
    needSatisfier.characteristics = form.characteristics;
    needSatisfier.kindOf = form.kindOf;
    await needSatisfier.save();
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

async function getConnectedNeedSatisfiers(req, res, next) {
  let startNodeURI = req.params.startNodeURI;
  if (startNodeURI) startNodeURI = SPARQL.ensureFullURI(startNodeURI);
  const query = `
    PREFIX : <http://snmi#>
    CONSTRUCT {
        ?s :hasType ?type.
        ?s :kindOf ?k.
        ?s2 :hasType ?type2.
        ?s2 :kindOf ?k2.
    } WHERE {
        ?s a :NeedSatisfier.
        ?s :hasType ?type.
        OPTIONAL {?s :kindOf ?k.}
        ${startNodeURI ? `
        {
            ?s :kindOf* <${startNodeURI}>
        } UNION {
            bind(<${startNodeURI}> as ?s)
            ?s :kindOf* ?s2.
    
            ?s2 :hasType ?type2.
            OPTIONAL {?s2 :kindOf ?k2.}
        }` : ''}}`;
  const result = {};
  await GraphDB.sendConstructQuery(query, ({subject, predicate, object}) => {
    if (!result[subject.value]) {
      result[subject.value] = {kindOf: []};
    }
    if (predicate.value === 'http://snmi#kindOf') {
      result[subject.value].kindOf.push(object.value);
    } else if (predicate.value === 'http://snmi#hasType') {
      result[subject.value].type = object.value;
    }
  });
  return res.status(200).json({success: true, data: result});
}


module.exports = {
  createNeedSatisfier,
  fetchNeedSatisfiers,
  deleteNeedSatisfier,
  fetchNeedSatisfier,
  updateNeedSatisfier,
  getConnectedNeedSatisfiers
}