const {
  GDBOrganizationModel, GDBServiceProviderModel
} = require("../../models");
const {GDBProgramModel} = require("../../models/program/program");
const {GDBServiceModel} = require("../../models/service/service");
const {createSingleGenericHelper, fetchSingleGenericHelper, updateSingleGenericHelper,
  deleteSingleGenericHelper, fetchGenericDatasHelper} = require("../genericData");
const {findCharacteristicById, PredefinedCharacteristics, PredefinedInternalTypes} = require("../characteristics");
const {getProviderById} = require("../genericData/serviceProvider");
const {getDynamicFormsByFormTypeHelper} = require("../dynamicForm");

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
      return res.status(404).json({message: 'Partner organization not found' + e.message ? ': ' + e.message : null});
    }

    const organization = await getOrganization(organizationGeneric);

    if (organization.status === 'Partner') {
      if (organization.endpointUrl && organization.endpointPort && organization.apiKey) {
        const url = new URL(organization.endpointUrl);
        url.port = organization.endpointPort;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(url, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'X-API-KEY': organization.apiKey,
          },
        });
        clearTimeout(timeout);

        if (response.status >= 400 && response.status < 600) {
          return res.status(response.status).json({message: 'Bad response from partner: ' + response.status});
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
  assets = assets.filter(asset => asset.serviceProvider?._id === organizationGenericId);

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

    for (assetIndex in assets) {
      const assetGeneric = assets[assetIndex];
      if (assetGeneric[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] === assetData.id) {
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
  providers = providers.filter(provider => provider.volunteer?.serviceProvider?._id === organizationGenericId);

  providerLoop:
  for (volunteerData of partnerData.organization['volunteers']) {
    const volunteer = {fields: {}};
    for (characteristic in characteristics) {
      volunteer.fields[PredefinedCharacteristics[characteristic]._uri.split('#')[1]] = volunteerData[characteristics[characteristic]];
    }
    for (internalType in internalTypes) {
      volunteer.fields[PredefinedInternalTypes[internalType]._uri.split('#')[1]] = internalTypes[internalType]();
    }
    volunteer.formId = formId;

    for (providerIndex in providers) {
      const provider = providers[providerIndex];
      if (provider.volunteer[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] === volunteerData.id) {
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
    console.log(JSON.stringify(PredefinedCharacteristics));
    organization.fields[PredefinedCharacteristics['Organization Name']._uri.split('#')[1]] = partnerData.organization.organizationName;
    organization.fields[PredefinedCharacteristics['Description']._uri.split('#')[1]] = partnerData.organization.description;
    organization.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]] = partnerData.organization.address; // TODO
    organization.formId = organizationFormId;
    console.log(organization);

    const provider = await getProviderById(id);
    const providerType = provider.type;
    if (providerType !== 'organization') {
      throw new Error('Provider is not an organization');
    }
    const genericId = provider[providerType]._id;
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
        //'Address': 'address' TODO
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
        if (characteristic.name === 'Address') { // TODO
          organization.address = data;
        }
      }
    }
  }
  return organization;
}

async function getOrganizationAssets(organizationId, assetType, characteristics, types, partnerOrganizations) {
  let assets = await fetchGenericDatasHelper(assetType);
  assets = assets.filter(asset => (
    (asset.serviceProvider?._id === organizationId || asset.organization?._id === organizationId)
      && (asset.shareability === 'Shareable with all organizations'
        || (asset.shareability === 'Shareable with partner organizations'
          && (asset.partnerOrganizations.some(org => partnerOrganizations.includes(org))
            || asset.partnerOrganizations.map(org => org._uri).some(org => partnerOrganizations.includes(org)))))
  ));

  const assetList = [];
  for (assetGeneric of assets) {
    const asset = types.reduce((accumulator, current) => (accumulator[current.key] = assetGeneric[current.value], accumulator), {}); // comma operator
    for (let [key, data] of Object.entries(assetGeneric)) {
      if (key === 'characteristicOccurrences') {
        for (object of data) {
          for (characteristic in characteristics) {
            if (object.occurrenceOf?.name === characteristic) {
              asset[characteristics[characteristic]] = object.dataStringValue;
            }
          }
        }
      }
    }
    assetList.push(asset);
  }
  return assetList;
}

async function sendOrganization(req, res, next) {
  try {
    const {id} = req.params;

    let genericId;
    let organizationGeneric;
    try {
      const provider = await getProviderById(id);
      const providerType = provider.type;
      if (providerType !== 'organization') {
        throw new Error('Provider is not an organization');
      }
      genericId = provider[providerType]._id;
      organizationGeneric = await fetchSingleGenericHelper(providerType, genericId);
    } catch (e) {
      return res.status(404).json({message: 'Organization not found' + e.message ? ': ' + e.message : null});
    }

    const myApiKey = req.header('X-MY-API-KEY');
    const yourApiKey = req.header('X-YOUR-API-KEY');

    const organization = await getOrganization(organizationGeneric);
    if (myApiKey !== organization.apiKey) {
      return res.status(403).json({message: 'API key is incorrect'});
    }

    var partnerOrganizations = await fetchGenericDatasHelper('organization')
    partnerOrganizations = partnerOrganizations
      .filter(organization => organization.status === 'Partner' && organization.apiKey === yourApiKey)
      .map(organization => organization._uri);

    let programs = await fetchGenericDatasHelper('program');
    programs = programs.filter(program =>
      ((program.serviceProvider?._id === id) && (program.shareability !== 'Not shareable'))
    );

    organization.programs = await getOrganizationAssets(id, 'program', {
        'Program Name': 'programName',
        'Description': 'description',
        'Shareability': 'shareability',
        'Address': 'address'
      }, [
        {key: 'id', value: '_id'},
        {key: 'manager', value: 'manager'},
        {key: 'serviceProvider', value: 'serviceProvider'}
      ], partnerOrganizations);
    organization.services = await getOrganizationAssets(id, 'service', { // TODO also services of shared programs
        'Service Name': 'serviceName',
        'Description': 'description',
        'Shareability': 'shareability',
        'Address': 'address'
      }, [
        {key: 'id', value: '_id'},
        {key: 'manager', value: 'manager'},
        {key: 'serviceProvider', value: 'serviceProvider'},
        {key: 'program', value: 'program'}
      ], partnerOrganizations);
    organization.volunteers = await getOrganizationAssets(genericId, 'volunteer', {
        'First Name': 'firstName',
        'Last Name': 'lastName',
        'Description': 'description',
        'Shareability': 'shareability',
      }, [
        {key: 'id', value: '_id'},
        {key: 'organization', value: 'organization'},
        {key: 'address', value: 'address'}
      ], partnerOrganizations);

    return res.status(200).json({organization, success: true});
  } catch (e) {
    return res.status(400).json({message: e?.message});
  }
}

module.exports = {
  fetchOrganization,
  updateOrganization,
  sendOrganization
};
