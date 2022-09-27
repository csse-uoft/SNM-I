
const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedModel} = require("../../models/need");



const createNeedSatisfier = async (req, res, next) => {
  const form = req.body;
  // fetch characteristic and replace it into the form
  if(!form)
    return res.status(400).json({success: false, message: 'Information is not given'})
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
    const needSatifiers = await GDBNeedSatisfierModel.find({});
    return res.status(200).json({success: true, needSatifiers});
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
    const needSatisfier = await GDBNeedSatisfierModel.findById(id);
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
  if(!form)
    return res.status(400).json({success: false, message: 'Information is not provided'});
  try{
    const needSatisfier = await GDBNeedSatisfierModel.findById(id);
    needSatisfier.type = form.type;
    needSatisfier.codes = form.codes;
    await needSatisfier.save();
    return res.status(200).json({success: true});
  }catch (e){
    next(e);
  }
};


module.exports = {createNeedSatisfier, fetchNeedSatisfiers, deleteNeedSatisfier, fetchNeedSatisfier, updateNeedSatisfier}