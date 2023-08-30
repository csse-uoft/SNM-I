const {GDBCharacteristicModel, GDBClientModel, GDBServiceProviderModel} = require("../../models");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {MDBUsageModel} = require("../../models/usage");
const {GraphDB, regexBuilder} = require("graphdb-utils");
const {parsePhoneNumber} = require("../../helpers/phoneNumber");


const genericType2Model = {
  client: GDBClientModel,
  serviceProvider: GDBServiceProviderModel
};

const genericItemType2Model = {
  characteristic: GDBCharacteristicModel,
  question: GDBQuestionModel

};

// ex. return all characteristics associated with client
async function fetchForAdvancedSearch(req, res, next) {
  try {
    // genericType: client, serviceProvider...
    // genericItemType: characteristic, question ...
    const {genericType, genericItemType} = req.params;
    if (!genericType || !genericItemType)
      res.status(400).json({success: false, message: "genericType or genericItemType is not given"});
    const usage = await MDBUsageModel.findOne({option: genericItemType, genericType: genericType});
    let data;
    if (usage) {
      data = await Promise.all(usage.optionKeys.map(async id => {
        return (await genericItemType2Model[genericItemType].findOne({_id: id}, {populates: ['implementation.fieldType']}))
      }));
      data = data.filter(value => value != null);
    }
    res.status(200).json({
      success: true,
      data: data || [],
      message: usage ? '' : `There is no such ${genericItemType} associated with ${genericType}.`
    });
  } catch (e) {
    next(e);
  }
}


async function advancedSearchGeneric(req, res, next) {
  const {genericType, genericItemType} = req.params; // genericType: ex. client; genericItemType: ex. characteristic
  const {searchConditions, searchTypes} = req.body; // searchConditions: ex. {1: 'emolee', 2: 'Cheng'}
  try {
    const conditions = [];
    const key = genericItemType + 'Occurrences';
    for (let genericItemId in searchConditions) {
      const value = searchConditions[genericItemId];
      if (searchTypes[genericItemId] === 'TextField') { // string
        conditions.push(
          {occurrenceOf: `:${genericItemType}_${genericItemId}`, dataStringValue: {$regex: regexBuilder(value, 'i')}}
        );
      } else if (searchTypes[genericItemId] === 'NumberField') { // number range
        conditions.push(
          {occurrenceOf: `:${genericItemType}_${genericItemId}`, dataNumberValue: {$lt: value.max, $gt: value.min}}
        );
      } else if(searchTypes[genericItemId] === 'PhoneNumberField'){ // phoneNumber object
        const {areaCode, countryCode, phoneNumber} = parsePhoneNumber(value)
        conditions.push(
          {occurrenceOf: `:${genericItemType}_${genericItemId}`, objectValue: {areaCode, countryCode, phoneNumber}}
        );
      }else{

      }
    }
    const data = await genericType2Model[genericType].find({[key]: {$and: conditions}});
    return res.status(200).json({success: true, data});
  } catch (e) {
    next(e);
  }
}


module.exports = {fetchForAdvancedSearch, advancedSearchGeneric};