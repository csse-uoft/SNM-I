const {
  GDBServiceProviderModel
} = require("../../models");
const {GDBProgramModel} = require("../../models/program/program");
const {GDBServiceModel} = require("../../models/service/service");
const {GDBOrganizationModel} = require("../../models/organization");
const {createSingleGenericHelper, fetchSingleGenericHelper, updateSingleGenericHelper,
  deleteSingleGenericHelper, fetchGenericDatasHelper} = require("../genericData");
const {findCharacteristicById, initPredefinedCharacteristics, PredefinedCharacteristics, PredefinedInternalTypes} = require("../characteristics");
const {getProviderById} = require("../genericData/serviceProvider");
const {getDynamicFormsByFormTypeHelper, getIndividualsInClass} = require("../dynamicForm");
const {convertAddressForSerialization, convertAddressForDeserialization} = require("../address/misc");
const {GDBVolunteerModel} = require("../../models/volunteer");

async function fetchOrganization(req, res, next) {
  try {
    const {id} = req.params;

    let organizationGeneric;
    try {
      const provider = await getProviderById(id);
      const providerType = provider.type;
      if (providerType !== 'organization') {
        throw new Error('Provider is not an organization');
      }
      const genericId = provider[providerType]._id;
      organizationGeneric = await fetchSingleGenericHelper(providerType, genericId);
    } catch (e) {
      return res.status(404).json({message: 'Partner organization not found' + (e.message ? ': ' + e.message : '')});
    }

    const organization = await getOrganization(organizationGeneric);

    if (organization.status === 'Partner') {
      if (organization.endpointUrl && organization.endpointPort && organization.apiKey) {
        const endpointUrl = organization.endpointUrl;
        const url = new URL('/public/partnerNetwork/organization/', endpointUrl.startsWith('http') ? endpointUrl : 'https://' + endpointUrl);
        url.port = organization.endpointPort;

        const homeOrganization = await GDBOrganizationModel.findOne({status: 'Home'}, {populates: []});
        const senderApiKey = !!homeOrganization ? homeOrganization.apiKey : null;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(url, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'X-RECEIVER-API-KEY': organization.apiKey,
            ...(!!senderApiKey && {'X-SENDER-API-KEY': senderApiKey}),
            'Referer': req.headers.host,
          },
        });
        clearTimeout(timeout);

        if (response.status >= 400 && response.status < 600) {
          const json = await response.json();
          return res.status(404).json({message: 'Bad response from partner: ' + response.status + ': ' + (json.message || JSON.stringify(json))});
        }
        return res.json(await response.json());
      } else {
        return res.status(400).json({message: 'The partner organization does not have a valid URL, port, and/or API key'});
      }
    } else {
      return res.status(400).json({message: 'The entity to refresh is not a partner organization'});
    }
  } catch (e) {
    return res.status(400).json({message: e?.message});
  }
}

async function updateOrganizationGenericAssets(organizationGenericId, partnerData, assetType,
    characteristics, internalTypes, model) {
  const forms = await getDynamicFormsByFormTypeHelper(assetType);
  if (forms.length > 0) {
    var formId = forms[0]._id; // Select the first form
  } else {
    throw Error(`No ${assetType} form available`);
  }

  let assets = await fetchGenericDatasHelper(assetType);
console.log(JSON.stringify(assets))
console.log(organizationGenericId)
  assets = assets.filter(asset => asset.serviceProvider?.organization?._id === organizationGenericId);

  assetLoop:
  for (assetData of partnerData.organization[assetType + 's']) {
    const asset = {fields: {}};
    for (characteristic in characteristics) {
      asset.fields[PredefinedCharacteristics[characteristic]._uri.split('#')[1]] = assetData[characteristics[characteristic]];
    }
    for (internalType in internalTypes) {
      asset.fields[PredefinedInternalTypes[internalType]._uri.split('#')[1]] = internalTypes[internalType](assetData.program?.split('_')[1]);
    }
    asset.formId = formId;
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
console.log(JSON.stringify(assetData))
console.log(JSON.stringify(assets))
    for (assetIndex in assets) {
      const assetGeneric = assets[assetIndex];
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
console.log(assetGeneric.idInPartnerDeployment)
console.log(assetData.id)
      if (assetGeneric.idInPartnerDeployment == assetData.id) {
        await (await updateSingleGenericHelper(assetGeneric._id, asset, assetType)).save();
        assets.splice(assetIndex, 1);
        continue assetLoop;
      }
    }

    // If we reach this point, then assetData is a new asset in the partner deployment
    await model(await createSingleGenericHelper(asset, assetType)).save();
  }

  // Local assets associated with this organization still left in this array are to be deleted
  for (asset of assets) {
    await deleteSingleGenericHelper(assetType, asset._id);
  }
}

async function updateOrganizationVolunteers(organizationGenericId, partnerData,
    characteristics, internalTypes) {
  const forms = await getDynamicFormsByFormTypeHelper('volunteer');
  if (forms.length > 0) {
    var formId = forms[0]._id; // Select the first form
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
  for (volunteerData of partnerData.organization['volunteers']) {
    const volunteer = {fields: {}};
    for (characteristic in characteristics) {
      volunteer.fields[PredefinedCharacteristics[characteristic]._uri.split('#')[1]] = volunteerData[characteristics[characteristic]];
    }
    for (internalType in internalTypes) {
      volunteer.fields[PredefinedInternalTypes[internalType]._uri.split('#')[1]] = internalTypes[internalType]();
    }
    if (volunteerData.address) {
      volunteer.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]] = await convertAddressForDeserialization(volunteerData.address);
    }
    volunteer.formId = formId;

    for (providerIndex in providers) {
      const provider = providers[providerIndex];
      if (provider.volunteer.idInPartnerDeployment == volunteerData.id) {
        const oldGeneric = await GDBVolunteerModel.findOne({ _id: provider.volunteer._id }, {populates: ['address']});
        if (volunteer.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]] && oldGeneric.address) {
          volunteer.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]]._uri = oldGeneric.address._uri;
          volunteer.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]]._id = oldGeneric.address._id;
        }

        const generic = await updateSingleGenericHelper(provider.volunteer._id, volunteer, 'volunteer');
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
  for (provider of providers) {
    await deleteSingleGenericHelper('volunteer', provider.volunteer._id);
    await GDBServiceProviderModel.findByIdAndDelete(provider._id);
  }
}

async function updateOrganization(req, res, next) {
  try {
    const partnerData = req.body;
    const {id} = req.params;

    const organizationForms = await getDynamicFormsByFormTypeHelper('organization');
    if (organizationForms.length > 0) {
      var organizationFormId = organizationForms[0]._id; // Select the first form
    } else {
      return res.status(400).json({message: 'No organization form available'});
    }

    const organization = {fields: {}};
    if (Object.keys(PredefinedCharacteristics).length == 0) {
      await initPredefinedCharacteristics();
    }

    if (!partnerData.organization) {
      return res.status(400).json({message: 'Data does not include an organization'});
    }

    organization.fields[PredefinedCharacteristics['Organization Name']._uri.split('#')[1]] = partnerData.organization.name || '';
    organization.fields[PredefinedCharacteristics['Description']._uri.split('#')[1]] = partnerData.organization.description || partnerData.organization.Description || '';
    organization.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]] = partnerData.organization.address ? await convertAddressForDeserialization(partnerData.organization.address) : null;
    organization.formId = organizationFormId;

    const provider = await getProviderById(id);
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

    const organizationObj = await updateSingleGenericHelper(genericId, organization, 'organization');
    provider['organization'] = organizationObj;
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
    for (programData of partnerData.organization['programs']) {
      for (programIndex in programs) {
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

    return res.status(200).json({success: true});
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: e?.message});
  }
}

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
      } else if (typeof data === 'object') {
        // if (characteristic.name === 'Address') { // TODO
        //   organization.address = data;
        // }
      }
    }
  }
  return organization;
}

async function getGenericAsset(assetGenerics, characteristics, types) {
  const assets = [];
  for (assetGeneric of assetGenerics) {
    const asset = types.reduce((accumulator, current) => (accumulator[current.key] = assetGeneric[current.value], accumulator), {}); // comma operator
    if (asset.address) {
      await convertAddressForSerialization(asset.address);
    }

    for (let [key, data] of Object.entries(assetGeneric)) {
      if (key === 'characteristicOccurrences') {
        for (object of data) {
          if (object.occurrenceOf?.name in characteristics) {
            asset[characteristics[object.occurrenceOf?.name]] = object.dataStringValue || object.dataNumberValue || object.dataBooleanValue || object.dataDateValue || object;
          }
        }
      }
    }
    assets.push(asset);
  }
  return assets;
}

async function getOrganizationAssets(organizationId, assetType, characteristics, types, partnerOrganizations, programs) {
  let assets = await fetchGenericDatasHelper(assetType);
  const shareabilities = await getIndividualsInClass(':Shareability');
  assets = assets.filter(asset => (
    (asset.serviceProvider?.organization?._id === organizationId || asset.organization?._id === organizationId)
    && (shareabilities[asset.shareability] === 'Shareable with all organizations'
      || (shareabilities[asset.shareability] === 'Shareable with partner organizations'
        && (asset.partnerOrganizations?.some(org => partnerOrganizations.includes(org))
          || asset.partnerOrganizations?.map(org => org._uri).some(org => !!org && partnerOrganizations.includes(org))))
      || (assetType === 'service' && asset.shareability === 'Not shareable' && programs.map(program => program.id).includes(asset.program?.split('_')[1])))
  ));

  return getGenericAsset(assets, characteristics, types);
}

async function sendOrganization(req, res, next) {
  try {
    const organization = await GDBOrganizationModel.findOne({status: 'Home'}, {populates: ['characteristicOccurrences.occurrenceOf', 'address']});
    if (!organization) {
      throw new Error('This deployment has no home organization');
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

    var partnerOrganizations = await fetchGenericDatasHelper('organization')
    partnerOrganizations = partnerOrganizations
      .filter(organizationObj => organizationObj.status === 'Partner' && organizationObj.apiKey === senderApiKey && organizationObj.endpointUrl === req.headers.referer)
      .map(organizationObj => organizationObj._uri);
    
    for (characteristicOccurrence of organization.characteristicOccurrences) {
      if ('occurrenceOf' in characteristicOccurrence) {
        if ('dataStringValue' in characteristicOccurrence) {
          organization[characteristicOccurrence.occurrenceOf.description.split(' ').join('_')] = characteristicOccurrence.dataStringValue;
        } else if ('dataNumberValue' in characteristicOccurrence) {
          organization[characteristicOccurrence.occurrenceOf.description.split(' ').join('_')] = organization[characteristicOccurrence.dataNumberValue]
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
      ], partnerOrganizations);
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
      ], partnerOrganizations);

    return res.status(200).json({organization, success: true});
  } catch (e) {
    return res.status(400).json({message: e?.message});
  }
}

module.exports = {
  fetchOrganization,
  updateOrganization,
  getGenericAsset,
  sendOrganization
};
