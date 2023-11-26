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
    let data = [];

    if (req.query.searchitem === undefined || req.query.searchitem === ""){
      data = await GDBServiceProviderModel.find({},
          {
            populates: ['organization.characteristicOccurrences.occurrenceOf',
              'organization.questionOccurrence', 'volunteer.characteristicOccurrences.occurrenceOf',
              'volunteer.questionOccurrence',]
          });
    } else {
      const array = await sendSearchQuery(req.query.searchitem + "*");
      if (array.length !== 0){
        data = await GDBServiceProviderModel.find({_id: {$in: array}},
          {
            populates: ['organization.characteristicOccurrences.occurrenceOf',
              'organization.questionOccurrence', 'volunteer.characteristicOccurrences.occurrenceOf',
              'volunteer.questionOccurrence',]
          });
      }
    }

    return res.status(200).json({success: true, data});
  } catch (e) {
    next(e);
  }
};

async function sendSearchQuery(searchitem) {
  // send the query
  let query =
      "http://localhost:7200/repositories/snmi?query=PREFIX%20%20%3A%20%20%20%20%20%3Chttp%3A%2F%2Fsnmi%23%3E%20PREFIX%20%20rdf%3A%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%20PREFIX%20%20luc-index%3A%20%3Chttp%3A%2F%2Fwww.ontotext.com%2Fconnectors%2Flucene%2Finstance%23%3E%20PREFIX%20%20ic%3A%20%20%20%3Chttp%3A%2F%2Fontology.eil.utoronto.ca%2Ftove%2Ficontact%23%3E%20PREFIX%20%20tove_org%3A%20%3Chttp%3A%2F%2Fontology.eil.utoronto.ca%2Ftove%2Forganization%23%3E%20PREFIX%20%20luc%3A%20%20%3Chttp%3A%2F%2Fwww.ontotext.com%2Fconnectors%2Flucene%23%3E%20PREFIX%20%20onto%3A%20%3Chttp%3A%2F%2Fwww.ontotext.com%2F%3E%20%20SELECT%20DISTINCT%20%20%3Fe0%20WHERE%20%20%20%7B%20BIND(%22" + searchitem + "%22%20AS%20%3Fsearchitem)%20%20%20%20%20%7B%20%3Fe0%20%20%3Fp0%20%20%20%20%20%20%20%3Fo0%20%3B%20%20%20%20%20%20%20%20%20%20%20%20rdf%3Atype%20%20%3AServiceProvider%20%20%20%20%20%7D%20%20%20%20%20%20%20%7B%20%20%20%7B%20%3Fo0%20%20onto%3Afts%20%20%3Fsearchitem%20%7D%20%20%20%20%20%20%20%20%20UNION%20%20%20%20%20%20%20%20%20%20%20%7B%20%3Fo0%20%20%3Fp1%20%20%3Fo1%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20%3Fo1%20%20onto%3Afts%20%20%3Fsearchitem%20%7D%20%20%20%20%20%20%20%20%20%20%20%20%20UNION%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20%3Fo1%20%20%3Fp2%20%20%20%20%20%20%20%3Fo2%20.%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Fo2%20%20onto%3Afts%20%20%3Fsearchitem%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20%7D%20%20%20%20%20UNION%20%20%20%20%20%20%20%7B%20%20%20%7B%20%3Fo0%20%20%20%20%20%20%3AhasCharacteristicOccurrence%20%20%3Fo1%20.%20%20%20%20%20%20%20%20%20%20%20%20%20%3Fsearch%20%20rdf%3Atype%20%20%20%20%20%20%20%20%20%20%20%20%20%20luc-index%3Acharacteristicoccurrence_connector%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20luc%3Aquery%20%20%20%20%20%20%20%20%20%20%20%20%20%3Fsearchitem%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20luc%3Aentities%20%20%20%20%20%20%20%20%20%20%3Fo1%20%20%20%20%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20%20%20UNION%20%20%20%20%20%20%20%20%20%20%20%7B%20%3Fo0%20%20%20%20%20%20ic%3AhasAddress%20%20%3Fo1%20.%20%20%20%20%20%20%20%20%20%20%20%20%20%3Fsearch%20%20rdf%3Atype%20%20%20%20%20%20%20luc-index%3Aaddress_connector%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20luc%3Aquery%20%20%20%20%20%20%3Fsearchitem%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20luc%3Aentities%20%20%20%3Fo1%20%20%20%20%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20%20%20UNION%20%20%20%20%20%20%20%20%20%20%20%7B%20%3Fsearch%20%20rdf%3Atype%20%20%20%20%20%20luc-index%3Aorganization_connector%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20luc%3Aquery%20%20%20%20%20%3Fsearchitem%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20luc%3Aentities%20%20%3Fo0%20%20%20%20%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20%20%20UNION%20%20%20%20%20%20%20%20%20%20%20%7B%20%3Fsearch%20%20rdf%3Atype%20%20%20%20%20%20luc-index%3Avolunteer_connector%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20luc%3Aquery%20%20%20%20%20%3Fsearchitem%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20luc%3Aentities%20%20%3Fo0%20%20%20%20%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20%7D%20%20%20%7D"
  const response = await fetch(query);

  const text = await response.text();

  return extractAllIndexes(text);

}

function extractAllIndexes(inputString) {
  let regex = / /;
  regex = /#serviceProvider_(\d+)/g;

  const allIndexes = [];
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    allIndexes.push(parseInt(match[1]));
  }

  return allIndexes;
}



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
    throw new Server400Error('No id is given');
  const provider = await GDBServiceProviderModel.findOne({_id: providerId},
    {
      populates: ['organization', 'volunteer',]
    });
  if (!provider)
    throw new Server400Error('No such provider');

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