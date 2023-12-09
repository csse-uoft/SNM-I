const {GDBCharacteristicModel, GDBClientModel, GDBServiceProviderModel} = require("../../models");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {MDBUsageModel} = require("../../models/usage");
const {GraphDB, regexBuilder} = require("graphdb-utils");
const {parsePhoneNumber} = require("../../helpers/phoneNumber");
const {GDBServiceModel} = require("../../models/service/service");


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


const fetchForServiceAdvancedSearch = async (req, res, next) => {
    const {genericType} = req.params;

    let connector_search_result;
    let fts_search_result;
    try {
        let data = [];

        if (req.body){
          let array = await fts_service_search(req.body);
          if (array.length !== 0) {
            let data_array = [];
            for (let i = 0; i < array.length; i++) {
              data_array.push(await GDBServiceModel.find({_uri: array[i]},
                  {populates: ['characteristicOccurrences.occurrenceOf', 'questionOccurrence']}));
            }
            data = data_array.flat();
          }
        } else {
          let array = await fts_service_search(req.body);
          if (array.length !== 0) {
            let data_array = [];
            data_array.push(await GDBServiceModel.find({},
                  {populates: ['characteristicOccurrences.occurrenceOf', 'questionOccurrence']}));
            data = data_array.flat();
          }

        }

        return res.status(200).json({data, success: true});

    } catch (e) {
        next(e);
    }

};

async function fts_service_search(searchitems) {
  // The initial query sent to the database
  const baseURI = "http://localhost:7200/repositories/snmi?query=";

  let name_query_fragment = "";
  if (searchitems.name && searchitems.name.trim() !== '') {
    // Concatenate the query related to 'name'
    name_query_fragment +=
        `{ ?e0  tove_org:hasName  ?o0 . ?o0  onto:fts "${searchitems.name}" }`;
  }

  let eligibility_query_fragment = "";
  if (searchitems.eligibilityCondition && searchitems.eligibilityCondition.trim() !== '') {
    // Concatenate the query related to 'eligibilityCondition'
    eligibility_query_fragment += `{ ?e0  :hasEligibilityCondition  ?o1 . ?o1  onto:fts "${searchitems.eligibilityCondition}" }`;
  }


  // FTS search part
  const sparqlQuery =
      `
      PREFIX  :     <http://snmi#>
      PREFIX  tove_org: <http://ontology.eil.utoronto.ca/tove/organization#>
      PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX  onto: <http://www.ontotext.com/>
      
      SELECT DISTINCT  ?e0
      WHERE
      { 
            ?e0 rdf:type :Service
            
            ${name_query_fragment}
            
            ${eligibility_query_fragment}
      }
      `;

  let query = baseURI + encodeURIComponent(sparqlQuery);

  const response = await fetch(query);
  const text = await response.text();
  return extractAllIndexes(text);

}

function extractAllIndexes(inputString) {
  const allIndexes = [];

  let lines = inputString.split(/\r?\n/);
  for (let i = 1; i < lines.length - 1; i++) {
    allIndexes.push(lines[i])
  }

  return allIndexes;
}



module.exports = {
  fetchForAdvancedSearch, advancedSearchGeneric, fetchForServiceAdvancedSearch
};
