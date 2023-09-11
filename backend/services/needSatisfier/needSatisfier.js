const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {getConnectedKindOfs} = require("../kindOf");

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
  return res.status(200).json({
    success: true,
    data: await getConnectedKindOfs(req.params.startNodeURI, ':NeedSatisfier', ':hasType')
  });
}


module.exports = {
  createNeedSatisfier,
  fetchNeedSatisfiers,
  deleteNeedSatisfier,
  fetchNeedSatisfier,
  updateNeedSatisfier,
  getConnectedNeedSatisfiers
}