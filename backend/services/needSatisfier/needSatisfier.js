
const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");



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

module.exports = {createNeedSatisfier, }