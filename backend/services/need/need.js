const {GDBCharacteristicModel} = require("../../models");
const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedModel} = require("../../models/need");
const {Server400Error} = require("../../utils");


const implementHelper = async (form) => {
  if (form.characteristic) {
    const characteristicId = form.characteristic;
    form.characteristic = await GDBCharacteristicModel.findById(characteristicId);
  } else {
    form.characteristic = undefined;
  }
  // fetch needSatisfier
  if(form.needSatisfier){
    if (!Array.isArray(form.needSatisfier))
      throw new Server400Error('Wrong input format');
    if (form.needSatisfier.length > 0) {
      const needSatisfierId = form.needSatisfier;
      form.needSatisfier = await GDBNeedSatisfierModel.findById(needSatisfierId);
    } else {
      form.needSatisfier = undefined;
    }
  }
}

const createNeed = async (req, res, next) => {
  const form = req.body;
  // fetch characteristic and replace it into the form
  try {
    await implementHelper(form);
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
    if (need.characteristic)
      need.characteristic = need.characteristic.split('_')[1];
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
  try{
    await implementHelper(form);
    const need = await GDBNeedModel.findById(id);
    need.type = form.type;
    need.changeType = form.changeType;
    need.characteristic = form.characteristic;
    need.needSatisfier = form.needSatisfier;
    need.codes = form.codes;
    await need.save();
    return res.status(200).json({success: true});
  }catch (e){
    next(e);
  }
}

module.exports = {createNeed, fetchNeeds, deleteNeed, fetchNeed, updateNeed};