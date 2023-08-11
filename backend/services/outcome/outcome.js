const {GDBCharacteristicModel} = require("../../models");
const {GDBOutcomeModel} = require("../../models/outcome/outcome");
const {Server400Error} = require("../../utils");


const implementHelper = async (form) => {
  if (form.characteristic) {
    const characteristicId = form.characteristic;
    form.characteristic = await GDBCharacteristicModel.findById(characteristicId);
  } else {
    form.characteristic = undefined;
  }
}
const formFormatChecking = (form) => {
  return (!form || !form.type || !form.changeType || !form.description || !form.characteristic) // todo: need to add codes checker
}

const createOutcome = async (req, res, next) => {
  const form = req.body;
  if (formFormatChecking(form))
    return res.status(400).json({success: false, message: 'Wrong information format'})
  try {

    await implementHelper(form);
    const outcome = GDBOutcomeModel(form);
    await outcome.save();
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const fetchOutcomes = async (req, res, next) => {
  try {
    const outcomes = await GDBOutcomeModel.find({}, {populates: ['characteristic']});
    return res.status(200).json({success: true, outcomes});
  } catch (e) {
    next(e);
  }
};

const deleteOutcome = async (req, res, next) => {
  const {id} = req.params;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  try {
    await GDBOutcomeModel.findByIdAndDelete(id);
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const fetchOutcome = async (req, res, next) => {
  const {id} = req.params;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  try {
    const outcome = await GDBOutcomeModel.findById(id);
    if (outcome.characteristic)
      outcome.characteristic = outcome.characteristic.split('_')[1];
    return res.status(200).json({success: true, outcome});
  } catch (e) {
    next(e);
  }

};

const updateOutcome = async (req, res, next) => {
  const {id} = req.params;
  const form = req.body;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  if(formFormatChecking(form))
    return res.status(400).json({success: false, message: 'Wrong information format'});
  try{
    await implementHelper(form);
    const outcome = await GDBOutcomeModel.findById(id);
    outcome.type = form.type;
    outcome.changeType = form.changeType;
    outcome.description = form.description;
    outcome.characteristic = form.characteristic;
    outcome.codes = form.codes;
    await outcome.save();
    return res.status(200).json({success: true});
  }catch (e){
    next(e);
  }
}

module.exports = {createOutcome, fetchOutcomes, deleteOutcome, fetchOutcome, updateOutcome};
