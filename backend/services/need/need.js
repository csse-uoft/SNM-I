const {GDBCharacteristicModel} = require("../../models");
const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedModel} = require("../../models/need");


const createNeed = async (req, res, next) => {
  const form = req.body;
  // fetch characteristic and replace it into the form
  try {
    if (form.characteristic) {
      const characteristicId = form.characteristic;
      form.characteristic = await GDBCharacteristicModel.findById(characteristicId);
    }else{
      form.characteristic = undefined;
    }
    // fetch needSatisfier
    if(!Array.isArray(form.needSatisfier))
      return res.status(400).json({success: false, message: `Wrong input format`});
    if (form.needSatisfier.length > 0) {
      const needSatisfierId = form.needSatisfier;
      form.needSatisfier = await GDBNeedSatisfierModel.findById(needSatisfierId);
    }else{
      form.needSatisfier = undefined;
    }

    const need = GDBNeedModel(form);
    await need.save();
    return res.status(200).json({success: true});
  }catch (e) {
    return res.status(400).json({success: false, message: `failed to create need`});
  }
}

const fetchNeeds = async (req, res, next) => {
  try {
    const needs = await GDBNeedModel.find({}, {populates: ['characteristic']});
    return res.status(200).json({success: true, needs});
  }catch (e){
    return res.status(400).json({success: false, message: 'Fail to fetch needs'})
  }
}

module.exports = {createNeed, fetchNeeds}