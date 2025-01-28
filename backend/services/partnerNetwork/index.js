const {GDBServiceProviderModel} = require("../../models");
const {GDBProgramModel} = require("../../models/program/program");
const {GDBServiceModel} = require("../../models/service/service");
const {GDBOrganizationModel} = require("../../models/organization");
const {createSingleGenericHelper, fetchSingleGenericHelper, updateSingleGenericHelper,
  deleteSingleGenericHelper, fetchGenericDatasHelper} = require("../genericData");
const {findCharacteristicById, initPredefinedCharacteristics, PredefinedCharacteristics,
  PredefinedInternalTypes} = require("../characteristics");
const {getProviderById} = require("../genericData/serviceProvider");
const {getDynamicFormsByFormTypeHelper, getIndividualsInClass} = require("../dynamicForm");
const {convertAddressForSerialization, convertAddressForDeserialization} = require("../address/misc");
const {GDBVolunteerModel} = require("../../models/volunteer");

/**
 * Requests that a partner deployment represented locally as the partner
 * organization with the given genericId send its home organization, and
 * returns the resulting data.
 */
async function fetchOrganizationHelper(req, genericId) {
  let organizationGeneric;
  try {
    organizationGeneric = await fetchSingleGenericHelper('organization', genericId);
  } catch (e) {
    throw new Error('Partner organization not found' + (e.message ? ': ' + e.message : ''));
  }

  const organization = await getOrganization(organizationGeneric);

  if (organization.status === 'Partner') {
    if (organization.endpointUrl && organization.endpointPort && organization.apiKey) {
      const endpointUrl = organization.endpointUrl;
      const url = new URL('/api/public/partnerNetwork/organization/', endpointUrl.startsWith('http') ? endpointUrl
                          : 'https://' + endpointUrl);
      url.port = organization.endpointPort;

      const homeOrganization = await GDBOrganizationModel.findOne({status: 'Home'}, {populates: []});
      const senderApiKey = !!homeOrganization ? homeOrganization.apiKey : null;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(url, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'X-RECEIVER-API-KEY': organization.apiKey,
          ...(!!senderApiKey && {'X-SENDER-API-KEY': senderApiKey}),
          // Frontend hostname without http(s)://. i.e. `127.0.0.1`, `localhost`, `example.com`
          'Referer': new URL(req.headers.origin).hostname,
        },
      });
      clearTimeout(timeout);

      if (response.status >= 400 && response.status < 600) {
        const json = await response.json();
        throw new Error('Bad response from partner: ' + response.status + ': '
                        + (json.message || JSON.stringify(json)));
      }
      return await response.json();
    } else {
      throw new Error('The partner organization does not have a valid URL, port, and/or API key');
    }
  } else {
    throw new Error('The entity to refresh is not a partner organization');
  }
}

async function fetchOrganization(req, res, next) {
  try {
    const {id} = req.params;
    
    const provider = await getProviderById(id);
    const providerType = provider.type;
    if (providerType !== 'organization') {
      throw new Error('Provider is not an organization');
    }
    const genericId = provider[providerType]._id;
    return res.json(await fetchOrganizationHelper(req, genericId));
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: e?.message});
  }
}

/**
 * Using the given partner data, update the generics of type assetType that
 * belong to the partner organization with id organizationGenericId, filling
 * in the given characteristics and internal types.
 * @param {number} organizationGenericId - ID of the organization for which generics are to be updated
 * @param {Object} partnerData - Data from the partner
 * @param {string} assetType - The type of the generics to update
 * @param {Object} characteristics - An object mapping characteristic label to characteristic name
 * @param {Object} internalTypes - An object mapping internal type URI to a function that optionally takes the ID of a
 *     program (so that if assetType is a service, and a service in the partner's data has a program, the service's
 *     program can be saved) and returns the value of the internal type
 * @param {import("graphdb-utils").GraphDBModelConstructor} model - The model of the generics to update.
 */
async function updateOrganizationGenericAssets(organizationGenericId, partnerData, assetType,
    characteristics, internalTypes, model) {
  const forms = await getDynamicFormsByFormTypeHelper(assetType);
  let formId;
  if (forms.length > 0) {
    formId = forms[0]._id; // Select the first form
  } else {
    throw Error(`No ${assetType} form available`);
  }

  let assets = await fetchGenericDatasHelper(assetType);
  assets = assets.filter(asset => asset.serviceProvider?.organization?._id === organizationGenericId);

  assetLoop:
  for (const assetData of partnerData.organization[assetType + 's'] || []) {
    const asset = {fields: {}};
    for (const characteristic in characteristics) {
      asset.fields[PredefinedCharacteristics[characteristic]._uri.split('#')[1]]
        = assetData[characteristics[characteristic]];
    }
    for (const internalType in internalTypes) {
      asset.fields[PredefinedInternalTypes[internalType]._uri.split('#')[1]]
        = internalTypes[internalType](assetData.program?.split('_')[1]);
    }
    asset.formId = formId;
    for (const assetIndex in assets) {
      const assetGeneric = assets[assetIndex];
      if (assetGeneric.idInPartnerDeployment == assetData.id) {
        const { generic } = await updateSingleGenericHelper(assetGeneric._id, asset, assetType);
        await generic.save();
        assets.splice(assetIndex, 1);
        continue assetLoop;
      }
    }

    // If we reach this point, then assetData is a new asset in the partner deployment
    const instanceData = await createSingleGenericHelper(asset, assetType);
    await model(instanceData).save();
  }

  // Local assets associated with this organization still left in this array are to be deleted
  for (const asset of assets) {
    await deleteSingleGenericHelper(assetType, asset._id);
  }
}

/**
 * Using the given partner data, update the volunteers that belong to the partner
 * organization with id organizationGenericId, filling in the given characteristics
 * and internal types.
 * @param {number} organizationGenericId - ID of the organization for which volunteers are to be updated
 * @param {Object} partnerData - Data from the partner
 * @param {Object} characteristics - An object mapping characteristic label to characteristic name
 * @param {Object} internalTypes - An object mapping internal type URI to a function that returns the value
 *     of the internal type.
 */
async function updateOrganizationVolunteers(organizationGenericId, partnerData,
    characteristics, internalTypes) {
  const forms = await getDynamicFormsByFormTypeHelper('volunteer');
  let formId;
  if (forms.length > 0) {
    formId = forms[0]._id; // Select the first form
  } else {
    throw Error(`No volunteer form available`);
  }

  let providers = await GDBServiceProviderModel.find({},
    {
      populates: ['organization.characteristicOccurrences.occurrenceOf',
        'organization.questionOccurrence', 'volunteer.characteristicOccurrences.occurrenceOf',
        'volunteer.questionOccurrence', 'organization.address', 'volunteer.address',
        'volunteer.organization',]
    });
  providers = providers.filter(provider => provider.volunteer?.organization?._id === organizationGenericId);

  providerLoop:
  for (const volunteerData of partnerData.organization['volunteers'] || []) {
    const volunteer = {fields: {}};
    for (const characteristic in characteristics) {
      volunteer.fields[PredefinedCharacteristics[characteristic]._uri.split('#')[1]]
        = volunteerData[characteristics[characteristic]];
    }
    for (const internalType in internalTypes) {
      volunteer.fields[PredefinedInternalTypes[internalType]._uri.split('#')[1]] = internalTypes[internalType]();
    }
    if (volunteerData.address) {
      volunteer.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]]
        = await convertAddressForDeserialization(volunteerData.address);
    }
    volunteer.formId = formId;

    for (const providerIndex in providers) {
      const provider = providers[providerIndex];
      if (provider.volunteer.idInPartnerDeployment == volunteerData.id) {
        const oldGeneric = await GDBVolunteerModel.findOne({ _id: provider.volunteer._id }, {populates: ['address']});
        if (volunteer.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]] && oldGeneric.address) {
          volunteer.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]]._uri = oldGeneric.address._uri;
          volunteer.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]]._id = oldGeneric.address._id;
        }

        const { generic } = await updateSingleGenericHelper(provider.volunteer._id, volunteer, 'volunteer');
        provider.volunteer = generic;
        await provider.save();

        providers.splice(providerIndex, 1);
        continue providerLoop;
      }
    }

    // If we reach this point, then volunteerData is a new volunteer in the partner deployment
    const provider = await GDBServiceProviderModel({type: 'volunteer'});
    provider.volunteer = await createSingleGenericHelper(volunteer, 'volunteer');
    if (provider.volunteer) {
      await provider.save();
    } else {
      throw Error("Failed to create volunteer");
    }
  }

  // Local volunteers associated with this organization still left in this array are to be deleted
  for (const provider of providers) {
    await deleteSingleGenericHelper('volunteer', provider.volunteer._id);
    await GDBServiceProviderModel.findByIdAndDelete(provider._id);
  }
}

/**
 * Using the given partner data, updates the partner organization with the given
 * providerId, as well as the organization's programs, services, and volunteers.
 */
async function updateOrganizationHelper(providerId, partnerData) {
  const organizationForms = await getDynamicFormsByFormTypeHelper('organization');
  let organizationFormId;
  if (organizationForms.length > 0) {
    organizationFormId = organizationForms[0]._id; // Select the first form
  } else {
    throw new Error('No organization form available');
  }

  const organization = {fields: {}};
  if (Object.keys(PredefinedCharacteristics).length == 0) {
    await initPredefinedCharacteristics();
  }

  if (!partnerData.organization) {
    throw new Error('Data does not include an organization');
  }

  const provider = await getProviderById(providerId);
  const providerType = provider.type;
  if (providerType !== 'organization') {
    throw new Error('Provider is not an organization');
  }
  const genericId = provider[providerType]._id;

  const oldGeneric = await GDBOrganizationModel.findOne({ _id: genericId }, {populates: ['address']});
  if (organization.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]] && oldGeneric.address) {
    organization.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]]._uri = oldGeneric.address._uri;
    organization.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]]._id = oldGeneric.address._id;
  }

  organization.fields[PredefinedCharacteristics['Organization Name']._uri.split('#')[1]]
    = partnerData.organization.name || '';
  organization.fields[PredefinedCharacteristics['Description']._uri.split('#')[1]]
    = partnerData.organization.description || partnerData.organization.Description || '';
  organization.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]]
    = partnerData.organization.address
      ? await convertAddressForDeserialization(partnerData.organization.address) : null;
  organization.formId = organizationFormId;

  const { generic } = await updateSingleGenericHelper(genericId, organization, 'organization');
  provider['organization'] = generic;
  await provider.save();

  await updateOrganizationGenericAssets(genericId, partnerData, 'program', {
      'Program Name': 'programName',
      'Description': 'description',
      'ID in Partner Deployment': 'id',
    }, {
      'serviceProviderForProgram': () => provider._uri
    }, GDBProgramModel);

  const partnerProgramIds = {}; // mapping from local program IDs to IDs of programs in the partner deployment
  let programs = await fetchGenericDatasHelper('program');
  programs = programs.filter(program => program.serviceProvider?._id === genericId);
  for (const programData of partnerData.organization['programs']) {
    for (const programIndex in programs) {
      const programGeneric = programs[programIndex];
      if (programGeneric.idInPartnerDeployment == programData.id) {
        partnerProgramIds[programData.id] = programGeneric._uri;
      }
    }
  }

  await updateOrganizationGenericAssets(genericId, partnerData, 'service', {
      'Service Name': 'serviceName',
      'Description': 'description',
      'ID in Partner Deployment': 'id',
    }, {
      'serviceProviderForService': () => provider._uri,
      'programForService': (partnerDeploymentProgramId) => partnerProgramIds[partnerDeploymentProgramId]
    }, GDBServiceModel);

  await updateOrganizationVolunteers(genericId, partnerData, {
      'First Name': 'firstName',
      'Last Name': 'lastName',
      'ID in Partner Deployment': 'id',
    }, {
      'organizationForVolunteer': () => provider[providerType]._uri
    });
}

/**
 * Deletes the partner organization with the given providerId, as well as the organization's
 * programs, services, and volunteers as per the given partner data.
 */
async function deleteOrganizationHelper(providerId, partnerData) {
  const provider = await getProviderById(providerId);
  const providerType = provider.type;
  if (providerType !== 'organization') {
    throw new Error('Provider is not an organization');
  }
  const genericId = provider[providerType]._id;

  await updateOrganizationGenericAssets(genericId, partnerData, 'program', {}, {}, GDBProgramModel);
  await updateOrganizationGenericAssets(genericId, partnerData, 'service', {}, {}, GDBServiceModel);
  await updateOrganizationVolunteers(genericId, partnerData, {}, {});
  
  await deleteSingleGenericHelper('organization', genericId);
  await GDBServiceProviderModel.findByIdAndDelete(providerId);
}

/**
 * Given non-empty partner data, updates the partner organization with the
 * given id, as well as the organization's programs, services, and volunteers;
 * or deletes them if the given partner data is empty.
 */
async function updateOrganization(req, res, next) {
  try {
    const partnerData = req.body;
    const {id} = req.params;

    if (!partnerData.organization) {
      return res.status(400).json({message: 'No organization provided'});
    } else if (Object.keys(partnerData.organization).length === 0) {
      await deleteOrganizationHelper(id, partnerData);
      return res.status(200).json({success: true});
    } else {
      await updateOrganizationHelper(id, partnerData);
      return res.status(200).json({success: true});
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: e?.message});
  }
}

/**
 * Convert an organization generic into a format in which it can be sent to a partner deployment.
 * @param {Object} organizationGeneric 
 * @returns {Promise<Object>} The organization with characteristic/internal type labels mapping to characteristics/internal
 *     types.
 */
async function getOrganization(organizationGeneric) {
  const organization = {};
  for (let [key, data] of Object.entries(organizationGeneric)) {
    const [type, key_id] = key.split('_');
    if (type === 'characteristic') {
      const characteristic = await findCharacteristicById(key_id);

      if (typeof data === 'string') {
        if (characteristic.name === 'Organization Status') {
          organization.status = data;
        } else if (characteristic.name === 'Endpoint URL') {
          organization.endpointUrl = data;
        } else if (characteristic.name === 'API Key') {
          organization.apiKey = data;
        } else if (characteristic.name === 'Organization Name') {
          organization.organizationName = data;
        } else if (characteristic.name === 'Description') {
          organization.description = data;
        }
      } else if (typeof data === 'number') {
        if (characteristic.name === 'Endpoint Port Number') {
          organization.endpointPort = data;
        }
      }
    }
  }
  return organization;
}

/**
 * Convert the given generic assets into a format in which they can be sent to a partner deployment.
 * @param {Object[]} assetGenerics - The assets to be converted
 * @param {Object} characteristics - An object mapping characteristic label to characteristic name
 * @param {Object[]} types - A list of objects, each of which represents an internal type and has two properties:
 *     key (the type label that the partner will read) and value (the type label used to store the internal type
 *     locally)
 * @returns {Promise<Object[]>} The assets with characteristic/internal type labels mapping to characteristics/internal types.
 */
async function getGenericAssets(assetGenerics, characteristics, types) {
  const assets = [];
  for (const assetGeneric of assetGenerics) {
    const asset = types.reduce((accumulator, current) => (accumulator[current.key]
      = assetGeneric[current.value], accumulator), {}); // comma operator
    if (asset.address) {
      await convertAddressForSerialization(asset.address);
    }

    for (let [key, data] of Object.entries(assetGeneric)) {
      if (key === 'characteristicOccurrences') {
        for (const object of data) {
          if (object.occurrenceOf?.name in characteristics) {
            asset[characteristics[object.occurrenceOf?.name]] = object.dataStringValue || object.dataNumberValue
              || object.dataBooleanValue || object.dataDateValue || object;
          }
        }
      }
    }
    assets.push(asset);
  }
  return assets;
}

/**
 * Convert an organization's assets (programs/services/volunteers) into a format in which they can be sent to a partner
 * deployment.
 * @param {number} organizationId - The ID of the organization the assets belong to
 * @param {string} assetType - The type of the assets to be converted
 * @param {Object} characteristics - An object mapping characteristic label to characteristic name
 * @param {Object[]} types - A list of objects, each of which represents an internal type and has two properties:
 *     key (the type label that the partner will read) and value (the type label used to store the internal type
 *     locally)
 * @param {string[]} partnerOrganizations - URIs of the partner organizations to which the assets are to be sent
 * @param {Object[]} programs - A list of the organization's programs
 * @returns {Promise<Object[]>} The organization's assets with characteristic/internal type labels mapping to
 *     characteristics/internal types.
 */
async function getOrganizationAssets(organizationId, assetType, characteristics, types, partnerOrganizations,
    programs) {
  let assets = await fetchGenericDatasHelper(assetType);
  const shareabilities = await getIndividualsInClass(':Shareability');
  /* Only send assets that belong to the organization with ID organizationId, and that are shareable with any of the
    given partner organizations */
  assets = assets.filter(asset => (
    (asset.serviceProvider?.organization?._id === organizationId || asset.organization?._id === organizationId)
    && (shareabilities[asset.shareability] === 'Shareable with all organizations'
      || (shareabilities[asset.shareability] === 'Shareable with partner organizations'
        && (asset.partnerOrganizations?.some(org => partnerOrganizations.includes(org))
          || asset.partnerOrganizations?.map(org => org._uri)
            .some(org => !!org && partnerOrganizations.includes(org))))
      || (assetType === 'service' && shareabilities[asset.shareability] === 'Not shareable'
        && programs.map(program => program.id).includes(asset.program?.split('_')[1])))
  ));

  return getGenericAssets(assets, characteristics, types);
}

/**
 * If this deployment has a home organization, sends the home organization, as
 * well as its programs, services, and volunteers (if any) to the partner
 * deployment sending the request.
 */
async function sendOrganization(req, res, next) {
  try {
    const organization = await GDBOrganizationModel.findOne({status: 'Home'},
      {populates: ['characteristicOccurrences.occurrenceOf', 'address']});
    if (!organization || organization.status !== 'Home') { // Redundant check for findOne bug
      // Will delete the copy of the organization in the partner deployment if it exists
      return res.status(200).json({organization: {}, success: true});
    }
    const genericId = organization._id;

    // Convert address to sendable format
    if (organization.address) {
      await convertAddressForSerialization(organization.address);
    }

    const receiverApiKey = req.header('X-RECEIVER-API-KEY');
    const senderApiKey = req.header('X-SENDER-API-KEY');
    if (receiverApiKey !== organization.apiKey) {
      return res.status(403).json({message: 'API key is incorrect'});
    }

    let partnerOrganizations = await fetchGenericDatasHelper('organization');
    partnerOrganizations = partnerOrganizations
      .filter(organizationObj => organizationObj.status === 'Partner' && organizationObj.apiKey === senderApiKey
        && new URL(organizationObj.endpointUrl).hostname === req.headers.referer)
      .map(organizationObj => organizationObj._uri);
    
    for (const characteristicOccurrence of organization.characteristicOccurrences) {
      if ('occurrenceOf' in characteristicOccurrence) {
        if ('dataStringValue' in characteristicOccurrence) {
          organization[characteristicOccurrence.occurrenceOf.description.split(' ').join('_')]
            = characteristicOccurrence.dataStringValue;
        } else if ('dataNumberValue' in characteristicOccurrence) {
          organization[characteristicOccurrence.occurrenceOf.description.split(' ').join('_')]
            = organization[characteristicOccurrence.dataNumberValue];
        }
      }
    }

    organization.programs = await getOrganizationAssets(genericId, 'program', {
        'Program Name': 'programName',
        'Description': 'description',
        'Shareability': 'shareability',
      }, [
        {key: 'id', value: '_id'},
        {key: 'manager', value: 'manager'},
        {key: 'serviceProvider', value: 'serviceProvider'}
      ], partnerOrganizations, []);
    organization.services = await getOrganizationAssets(genericId, 'service', {
        'Service Name': 'serviceName',
        'Description': 'description',
        'Shareability': 'shareability',
      }, [
        {key: 'id', value: '_id'},
        {key: 'manager', value: 'manager'},
        {key: 'serviceProvider', value: 'serviceProvider'},
        {key: 'program', value: 'program'}
      ], partnerOrganizations, organization.programs);
    organization.volunteers = await getOrganizationAssets(genericId, 'volunteer', {
        'First Name': 'firstName',
        'Last Name': 'lastName',
        'Description': 'description',
        'Shareability': 'shareability',
      }, [
        {key: 'id', value: '_id'},
        {key: 'organization', value: 'organization'},
        {key: 'address', value: 'address'},
      ], partnerOrganizations, []);

    return res.status(200).json({organization, success: true});
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: e?.message});
  }
}

module.exports = {
  fetchOrganization,
  fetchOrganizationHelper,
  updateOrganization,
  updateOrganizationHelper,
  deleteOrganizationHelper,
  getGenericAssets,
  sendOrganization,
  getOrganization
};
