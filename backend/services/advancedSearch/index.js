const {GDBCharacteristicModel, GDBClientModel, GDBOrganizationModel} = require("../../models");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {MDBUsageModel} = require("../../models/usage");
const {GraphDB} = require("../../utils/graphdb");


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
        return (await genericItemType2Model[genericItemType].findById(id))
      }))
    }
    res.status(200).json({success: true, data: data || [], message: usage?'':`There is no such ${genericItemType} associated with ${genericType}.`})
  }catch (e){
    next(e)
  }
}


async function advancedSearchGeneric(req, res, next) {
  const {genericType} = req.params;
  const searchConditions = req.body;
  try {
    for (const condition in searchConditions) {
      let query = `
        PREFIX : <http://snmi#>
        select * where { 
	          ?co ?p :characteristic_${condition}.
            ?co a :CharacteristicOccurrence.
        }`
      const possibleCO = []
      await GraphDB.sendSelectQuery(query, true, ({co, p}) => {
        possibleCO.push(co.value.split('_')[1])
      });


    }

    return res.status(200).json({success: true});

  } catch (e) {
    next(e)
  }
}


module.exports = {fetchForAdvancedSearch, advancedSearchGeneric}