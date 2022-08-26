import {GDBCharacteristicModel, GDBClientModel, GDBOrganizationModel} from "../../models";
import {GDBQuestionModel} from "../../models/ClientFunctionalities/question";


const genericType2Model = {
  client: GDBClientModel,
  organization: GDBOrganizationModel
}

const genericItemType2Model = {
  characteristic: GDBCharacteristicModel,
  question: GDBQuestionModel

}

async function fetchForAdvancedSearch(req, res, next){
  try{
    const {genericType, genericItemType} = req.params

  }catch (e){
    next(e)
  }
}

module.exports = {fetchForAdvancedSearch}