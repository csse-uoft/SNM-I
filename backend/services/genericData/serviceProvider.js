const {GDBServiceProviderModel} = require("../../models");
const {
    createSingleGenericHelper,
    fetchSingleGenericHelper,
    deleteSingleGenericHelper,
    updateSingleGenericHelper
} = require("./index");
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

        if (req.query.searchitem === undefined || req.query.searchitem === "") {
            data = await GDBServiceProviderModel.find({},
                {
                    populates: ['organization.characteristicOccurrences.occurrenceOf',
                        'organization.questionOccurrence', 'volunteer.characteristicOccurrences.occurrenceOf',
                        'volunteer.questionOccurrence',]
                });
        } else {
            const array = await fts_provider_search(req.query.searchitem + "*");
            if (array.length !== 0) {
                let data_array = [];
                for (let i = 0; i < array.length; i++) {
                    data_array.push(await GDBServiceProviderModel.find({_uri: array[i]},
                        {
                            populates: ['organization.characteristicOccurrences.occurrenceOf',
                                'organization.questionOccurrence', 'volunteer.characteristicOccurrences.occurrenceOf',
                                'volunteer.questionOccurrence',]
                        }));
                }
                data = data_array.flat();
            }

        }

        return res.status(200).json({success: true, data});
    } catch (e) {
        next(e);
    }
};

async function fts_provider_search(searchitem) {
    const baseURI = "http://localhost:7200/repositories/snmi?query=";

    const sparqlQuery =
        `
          PREFIX onto: <http://www.ontotext.com/>
          PREFIX : <http://snmi#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          
          select distinct ?e0
          where 
          {
              BIND("${searchitem}" AS ?searchitem)
          
              # Search :Service objects
              {
                  ?e0 ?p0 ?o0 .
                  ?e0 rdf:type :ServiceProvider .
              }.
          
              # Check if the object itself contains the search item
              {
                  ?o0 onto:fts ?searchitem .
              }
              UNION
              # Check if the object contains object containing the search item
              {   
                  ?o0 ?p1 ?o1 .
          
                  {
                      ?o1 onto:fts ?searchitem .
                  }
                  UNION
                  {
                      ?o1 ?p2 ?o2 .
          
                      {
                          ?o2 onto:fts ?searchitem .
                      }
                      UNION
                      {
                          ?o2 ?p3 ?o3 .
                          ?o3 onto:fts ?searchitem .
                      }
                  }
              }
          }            
      `

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


const updateServiceProvider = async (req, res, next) => {
    const {data, providerType} = req.body;
    const {id} = req.params;
    if (!providerType || !data || !id)
        return res.status(400).json({success: false, message: 'Type, data or id is not given'});
    try {
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