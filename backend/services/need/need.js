const {GDBNeedModel} = require("../../models/need/need");
const {getConnectedKindOfs} = require("../kindOf");

const formFormatChecking = (form) => {
  return (!form || !form.type || !form.changeType || !form.description || !form.characteristic || !form.needSatisfiers ||
    !(Array.isArray(form.needSatisfiers) || form.needSatisfiers.length === 0)) // todo: need to add codes checker
}

const createNeed = async (req, res, next) => {
  const form = req.body;
  if (formFormatChecking(form))
    return res.status(400).json({success: false, message: 'Wrong information format'})
  try {
    const need = GDBNeedModel(form);
    await need.save();
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const fetchNeeds = async (req, res, next) => {
  try {
    const needs = await GDBNeedModel.find({}, {populates: ['characteristic']});
    return res.status(200).json({success: true, needs});
  } catch (e) {
    next(e);
  }
};

const deleteNeed = async (req, res, next) => {
  const {id} = req.params;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  try {
    await GDBNeedModel.findByIdAndDelete(id);
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const fetchNeed = async (req, res, next) => {
  const {id} = req.params;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  try {
    const need = await GDBNeedModel.findById(id);
    return res.status(200).json({success: true, need});
  } catch (e) {
    next(e);
  }

};

const updateNeed = async (req, res, next) => {
  const {id} = req.params;
  const form = req.body;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  if (formFormatChecking(form))
    return res.status(400).json({success: false, message: 'Wrong information format'});
  try {
    const need = await GDBNeedModel.findById(id);
    need.type = form.type;
    need.changeType = form.changeType;
    need.description = form.description;
    need.characteristic = form.characteristic;
    need.needSatisfiers = form.needSatisfiers;
    need.codes = form.codes;
    need.kindOf = form.kindOf;
    await need.save();
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
}

async function getConnectedNeeds(req, res, next) {
  return res.status(200).json({
    success: true,
    data: await getConnectedKindOfs(req.params.startNodeURI, ':Need', ':hasType')
  });
}


module.exports = {createNeed, fetchNeeds, deleteNeed, fetchNeed, updateNeed, getConnectedNeeds};