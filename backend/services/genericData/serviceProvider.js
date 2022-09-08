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
  // GDBServiceProviderModel()
}

module.exports = {
  createSingleServiceProvider, fetchMultipleServiceProviders
}