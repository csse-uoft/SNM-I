const {GDBServiceProviderModel} = require("../../models");
const {
    createSingleGenericHelper,
    fetchSingleGenericHelper,
    deleteSingleGenericHelper,
    updateSingleGenericHelper
} = require("./index");
const {Server400Error} = require("../../utils");

const {graphdb} = require('../../config');

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
            fts_search_result = await fts_provider_search(req.query.searchitem + '*');
            connector_search_result = await connector_provider_search(req.query.searchitem + '*');

            let array = [...new Set([...fts_search_result, ...connector_search_result])];
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
    const baseURI = graphdb.addr + "/repositories/snmi?query=";

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

async function connector_provider_search(searchitem) {
    const baseURI = graphdb.addr + "/repositories/snmi?query=";

    const sparqlQuery =
        `
            PREFIX  :     <http://snmi#>
            PREFIX  luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
            PREFIX  luc:  <http://www.ontotext.com/connectors/lucene#>
            PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX  onto: <http://www.ontotext.com/>
            
            SELECT DISTINCT  ?e0 
            WHERE
              { 
                { ?e0  ?p0       ?o0 ;
                       rdf:type  :ServiceProvider
                }
                  { ?o0  rdf:type  :Organization
                    { ?search  rdf:type      luc-index:organization_connector ;
                               luc:query     "${searchitem}" ;
                               luc:entities  ?o0
                    }
                  }
                UNION
                  { ?o0  rdf:type  :Volunteer
                    { ?search  rdf:type      luc-index:volunteer_connector ;
                               luc:query     "${searchitem}" ;
                               luc:entities  ?o0
                    }
                  }
                UNION
                  { ?o0  ?p1  ?o1
                      { ?o0  rdf:type  :Organization }
                    UNION
                      { ?o0  rdf:type  :Volunteer }
                      { ?o1      rdf:type      :CharacteristicOccurrence .
                        ?search  rdf:type      luc-index:characteristicoccurrence_connector ;
                                 luc:query     "${searchitem}" ;
                                 luc:entities  ?o1
                      }
                    UNION
                      { ?o1      rdf:type      :Address .
                        ?search  rdf:type      luc-index:address_connector ;
                                 luc:query     "${searchitem}" ;
                                 luc:entities  ?o1
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
    // Normal split will give result like  [ 'xx', 'http://snmi#xx_xx', '' ]
    // So, we need to remove the first and last element

    let allIndexes = [];

    allIndexes = inputString.split(/\r?\n/);

    allIndexes.shift()

    allIndexes.pop()

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