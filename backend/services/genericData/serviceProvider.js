const {GDBServiceProviderModel} = require("../../models");
const {createSingleGenericHelper, fetchSingleGenericHelper, deleteSingleGenericHelper, updateSingleGenericHelper} = require("./index");
const {Server400Error} = require("../../utils");


const createSingleServiceProvider = async (req, res, next) => {
  const {providerType, data} = req.body;
  if (!providerType || !data)
    return res.status(400).json({message: 'Type or data is not given'});
  try {
    const provider = await GDBServiceProviderModel({type: providerType});
    provider[providerType] = await createSingleGenericHelper(data, providerType);
    if (provider[providerType]) {
      await provider.save();
      return res.status(200).json({success: true});
    } else {
      return res.status(400).json({message: 'Fail to create the provider'});
    }
  } catch (e) {
    next(e);
  }

};

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
    next(e);
  }
};

const updateServiceProvider = async (req, res, next) => {
  const {data, providerType} = req.body;
  const {id} = req.params;
  if (!providerType || !data || !id)
    return res.status(400).json({success: false, message: 'Type, data or id is not given'});
  try{
    const provider = await getProviderById(id);
    const providerType = provider.type;
    const genericId = provider[providerType]._id;

    const generic = await updateSingleGenericHelper(genericId, data, providerType);
    provider[providerType] = generic;
    await provider.save();
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
}

const getProviderById = async (providerId) => {
  if (!providerId)
    throw Server400Error('No id is given');
  const provider = await GDBServiceProviderModel.findOne({_id: providerId},
    {
      populates: ['organization', 'volunteer',]
    });
  if (!provider)
    throw Server400Error('No such provider');

  return provider;
};

const fetchSingleServiceProvider = async (req, res, next) => {
  const {id} = req.params;
  try {
    const provider = await getProviderById(id);
    const providerType = provider.type;
    const genericId = provider[providerType]._id;
    provider[providerType] = await fetchSingleGenericHelper(providerType, genericId);
    return res.status(200).json({provider, success: true});
  } catch (e) {
    next(e);
  }

};

const deleteSingleServiceProvider = async (req, res, next) => {
  const {id} = req.params;
  try {
    const provider = await getProviderById(id);
    const providerType = provider.type;
    const genericId = provider[providerType]._id;

    // delete the generic
    await deleteSingleGenericHelper(providerType, genericId);
    // delete the provider
    await GDBServiceProviderModel.findByIdAndDelete(id);
    return res.status(200).json({success: true});

  } catch (e) {
    next(e);
  }

};

module.exports = {
  createSingleServiceProvider, fetchMultipleServiceProviders, fetchSingleServiceProvider, deleteSingleServiceProvider,
  updateServiceProvider
};