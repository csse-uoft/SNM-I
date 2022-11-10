const {GDBInternalTypeModel} = require("../models/internalType");


const fetchInternalTypesByFormType = async (req, res, next) => {
  const {formType} = req.params
  const internalTypes = await GDBInternalTypeModel.find({formType: formType}, {populates:['implementation.fieldType']})
  return res.status(200).json({internalTypes, success: true})
}

module.exports = {fetchInternalTypesByFormType}