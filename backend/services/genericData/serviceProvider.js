const {GDBServiceProviderModel} = require("../../models");
const {createSingleGenericHelper, fetchSingleGenericHelper} = require("./index");
const {Server400Error} = require("../../utils");


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
    const provider = await GDBServiceProviderModel.findOne({_id: id},
      {
        populates: ['organization', 'volunteer',]
      });
    if(!provider)
      res.status(400).json({message: 'No such provider', success: false});
    const providerType = provider.type;
    const genericId = provider[providerType]._id;
    provider[providerType] = await fetchSingleGenericHelper(providerType, genericId);
    return res.status(200).json({provider, success: true});
  } catch (e) {
    next(e)
  }

}

module.exports = {
  createSingleServiceProvider, fetchMultipleServiceProviders, fetchSingleServiceProvider
}