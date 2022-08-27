const {GDBCharacteristicModel, GDBClientModel, GDBOrganizationModel} = require("../../models");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {MDBUsageModel} = require("../../models/usage");


const genericType2Model = {
  client: GDBClientModel,
  organization: GDBOrganizationModel
}

const genericItemType2Model = {
  characteristic: GDBCharacteristicModel,
  question: GDBQuestionModel

}

// ex. return all characteristics associated with client
async function fetchForAdvancedSearch(req, res, next){
  try{
    const {genericType, genericItemType} = req.params
    if(!genericType || !genericItemType)
      res.status(400).json({success: false, message:"genericType or genericItemType is not given"})
    const usage = await MDBUsageModel.find({option: genericItemType, genericType: genericType})
    if(usage){
      const data = await Promise.all(usage.optionKeys.map(async id => {
        return (await genericItemType2Model[genericItemType].findById(id)).name
      }))
    }
    res.status(200).json({success: true, data: usage?usage.optionKeys:[], message: usage?'':`There is no such ${genericItemType} associated with ${genericType}.`})
  }catch (e){
    next(e)
  }
}

module.exports = {fetchForAdvancedSearch}