
const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBCharacteristicModel} = require("../../models");

const implementHelper = async (form) => {
  form.characteristics = await GDBCharacteristicModel.find({_id: {$in: form.characteristics}});
  // todo: code also have to be implemented
}

const formFormatChecker = (form) => {
  return (!form || !form.type || !form.description || !form.characteristics ||
    !(Array.isArray(form.characteristics) || form.characteristics.length === 0)) // todo: need to add codes checker
}

const createNeedSatisfier = async (req, res, next) => {
  const form = req.body;
  // fetch characteristic and replace it into the form
  if(formFormatChecker(form))
    return res.status(400).json({success: false, message: 'Wrong information format'})
  try {
    await implementHelper(form);
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
  if(formFormatChecker(form))
    return res.status(400).json({success: false, message: 'Wrong information format'});
  try{
    await implementHelper(form);
    const needSatisfier = await GDBNeedSatisfierModel.findById(id);
    needSatisfier.type = form.type;
    needSatisfier.codes = form.codes;
    needSatisfier.description = form.description;
    needSatisfier.characteristics = form.characteristics;
    await needSatisfier.save();
    return res.status(200).json({success: true});
  }catch (e){
    next(e);
  }
};


module.exports = {createNeedSatisfier, fetchNeedSatisfiers, deleteNeedSatisfier, fetchNeedSatisfier, updateNeedSatisfier}