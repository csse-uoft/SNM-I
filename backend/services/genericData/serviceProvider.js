const {GDBServiceProviderModel} = require("../../models");
const {createSingleGenericHelper} = require("./index");


const createSingleServiceProvider = async (req, res, next) => {
  const {providerType, data} = req.body;
  if(!providerType || !data)
    return res.status(400).json({message: 'Type or data is not given'})
  try{
    const provider = {type: providerType}
    provider[providerType] = await createSingleGenericHelper(data, providerType);
    if(provider[providerType]){
      await GDBServiceProviderModel(provider).save();
      return res.status(200).json({success: true})
    }else{
      return res.status(400).json({message: 'Fail to create the provider'})
    }
  }catch (e) {
    next(e)
  }

}

const fetchMultipleServiceProviders = async (req, res, next) => {
  try {
    const data = await GDBServiceProviderModel.find({},
      {
        populates: ['organization.characteristicOccurrences.occurrenceOf',
          'organization.questionOccurrence', 'volunteer.characteristicOccurrences.occurrenceOf',
          'volunteer.questionOccurrence',]
      });
    return res.status(200).json({success: true, data});
  } catch (e) {
    next(e)
  }
}

const fetchSingleServiceProvider = async (req, res, next) => {
  const {id} = req.params;
  try {
    const data = await GDBServiceProviderModel.findOne({_id: id},
      {
        populates: ['organization.characteristicOccurrences.occurrenceOf',
          'organization.questionOccurrences', 'volunteer.characteristicOccurrences.occurrenceOf',
          'volunteer.questionOccurrences', 'organization.address', 'volunteer.address', 'volunteer.address.gender']
      });
    return res.status(200).json({data, success: true});
  } catch (e) {
    next(e)
  }

}

module.exports = {
  createSingleServiceProvider, fetchMultipleServiceProviders, fetchSingleServiceProvider
}