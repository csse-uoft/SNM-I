const {GDBCharacteristicModel, GDBClientModel, GDBOrganizationModel} = require("../../models");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {MDBUsageModel} = require("../../models/usage");
const {GraphDB, regexBuilder} = require("../../utils/graphdb");


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
    // genericType: client, organization...
    // genericItemType: characteristic, question ...
    const {genericType, genericItemType} = req.params
    if(!genericType || !genericItemType)
      res.status(400).json({success: false, message:"genericType or genericItemType is not given"})
    const usage = await MDBUsageModel.findOne({option: genericItemType, genericType: genericType})
    let data;
    if(usage){
      data = await Promise.all(usage.optionKeys.map(async id => {
        return (await genericItemType2Model[genericItemType].findOne({_id: id}, {populates: ['implementation']}))
      }))
    }
    res.status(200).json({success: true, data: data || [], message: usage?'':`There is no such ${genericItemType} associated with ${genericType}.`})
  }catch (e){
    next(e)
  }
}


async function advancedSearchGeneric(req, res, next) {
  const {genericType, genericItemType} = req.params; // genericType: ex. client; genericItemType: ex. characteristic
  const searchConditions = req.body; // searchConditions: ex. {1: 'emolee', 2: 'Cheng'}
  try {
    const conditions = []
    const key = genericItemType + 'Occurrences'
    for(let genericItemId in searchConditions){
      const value = searchConditions[genericItemId]
      if(typeof value === 'string'){
        conditions.push(
          {occurrenceOf: `:${genericItemType}_${genericItemId}`, dataStringValue: {$regex: regexBuilder(value, 'i')}}
        );
      }else if(typeof value.min === 'number' && typeof value.max === 'number'){
        conditions.push(
          {occurrenceOf: `:${genericItemType}_${genericItemId}`, dataNumberValue: {$lt: value.max, $gt: value.min}}
        );
      }
    }
    const data = await genericType2Model[genericType].find({[key]: {$and: conditions}})
    return res.status(200).json({success: true, data});
  } catch (e) {
    next(e)
  }
}


module.exports = {fetchForAdvancedSearch, advancedSearchGeneric}