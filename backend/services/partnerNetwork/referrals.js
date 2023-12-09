const {
  GDBClientModel, GDBServiceProviderModel
} = require("../../models");
const {GDBProgramModel} = require("../../models/program/program");
const {GDBServiceModel} = require("../../models/service/service");
const {GDBOrganizationModel} = require("../../models/organization");
const {GDBReferralModel} = require("../../models/referral");
const {createSingleGenericHelper, fetchSingleGenericHelper, updateSingleGenericHelper} = require("../genericData");
const {initPredefinedCharacteristics, PredefinedCharacteristics, PredefinedInternalTypes} = require("../characteristics");
const {getProviderById} = require("../genericData/serviceProvider");
const {getDynamicFormsByFormTypeHelper} = require("../dynamicForm");
const {getGenericAsset} = require("./index");

async function populateReferral(referralGeneric, receiverId) {
  const referral = {};

  const programId = parseInt((referralGeneric[PredefinedInternalTypes['programForReferral']._uri.split('#')[1]] || referralGeneric.program)?.split('_')[1]);
  if (!!programId) {
    const programGeneric = await GDBProgramModel.findOne({_id: programId},
      {populates: ['characteristicOccurrences.occurrenceOf']});
    if (programGeneric.serviceProvider?.split('_')[1] == receiverId) {
      referral.program = (await getGenericAsset([programGeneric], {
          'ID in Partner Deployment': 'id',
        }, []))[0];
    }
  }

  const serviceId = parseInt((referralGeneric[PredefinedInternalTypes['serviceForReferral']._uri.split('#')[1]] || referralGeneric.service)?.split('_')[1]);
  if (!!serviceId) {
    const serviceGeneric = await GDBServiceModel.findOne({_id: serviceId},
      {populates: ['characteristicOccurrences.occurrenceOf']});
    if (serviceGeneric.serviceProvider?.split('_')[1] == receiverId) {
      referral.service = (await getGenericAsset([serviceGeneric], {
          'ID in Partner Deployment': 'id',
        }, []))[0];
    }
  }

  const clientId = parseInt((referralGeneric[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]] || referralGeneric.client)?.split('_')[1]);
  if (!!clientId) {
    const clientGeneric = await GDBClientModel.findOne({_id: clientId},
      {populates: ['characteristicOccurrences.occurrenceOf']});
    referral.client = (await getGenericAsset([clientGeneric], {
        'First Name': 'firstName',
        'Last Name': 'lastName'
      }, [
        {key: 'id', value: '_id'}
      ]))[0];
  }

  return referral;
}

async function sendReferral(req, res, next) {
  try {
    const id = req.params.id;

    let referralGeneric;
    if (!!id) {
      try {
        referralGeneric = await fetchSingleGenericHelper('referral', id);
      } catch (e) {
        return res.status(404).json({message: 'Referral not found' + (e.message ? ': ' + e.message : '')});
      }
    } else {
      return res.status(400).json({message: 'No id provided'});
    }

    const receiverId = parseInt((referralGeneric[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]] || referralGeneric.receivingServiceProvider)?.split('_')[1]);
    if (!receiverId || isNaN(receiverId)) {
      return res.status(200).json({success: true, message: 'Receiving service provider for referral not found'});
    }

    let receiverGeneric;
    try {
      const provider = await getProviderById(receiverId);
      const providerType = provider.type;
      if (providerType !== 'organization') {
        return res.status(200).json({success: true, message: 'Receiving service provider is not an organization'});
      }
      const genericId = provider[providerType]._id;
      receiverGeneric = await fetchSingleGenericHelper(providerType, genericId);

      if (receiverGeneric[PredefinedCharacteristics['Organization Status']._uri.split('#')[1]] !== 'Partner') {
        return res.status(200).json({success: true, message: 'Receiving service provider is not a partner organization'});
      }
    } catch (e) {
      return res.status(404).json({message: 'Receiving organization not found' + (e.message ? ': ' + e.message : '')});
    }

    const referral = await populateReferral(referralGeneric, receiverId);
    referral.id = id;

    const endpointUrl = receiverGeneric[PredefinedCharacteristics['Endpoint URL']._uri.split('#')[1]];
    const url = new URL('/public/partnerNetwork/referral/', endpointUrl.startsWith('http') ? endpointUrl : 'https://' + endpointUrl);
    url.port = receiverGeneric[PredefinedCharacteristics['Endpoint Port Number']._uri.split('#')[1]];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      signal: controller.signal,
      method: req.method,
      headers: {
        'X-MY-API-KEY': receiverGeneric[PredefinedCharacteristics['API Key']._uri.split('#')[1]],
        'Referer': req.headers.host,
      },
      body: JSON.stringify(referral),
    });
    clearTimeout(timeout);

    if (response.status >= 400 && response.status < 600) {
      const json = await response.json();
      return res.status(400).json({message: 'Bad response from receiver: ' + response.status + ': ' + (json.message || JSON.stringify(json))});
    }
    return res.status(202).json({success: true, message: `Successfully created and sent a referral`});
  } catch (e) {
    return res.status(400).json({message: e?.message});
  }
}

async function getClient(partnerClientData, method, originalId) {
  const clientForms = await getDynamicFormsByFormTypeHelper('client');
  if (clientForms.length > 0) {
    var clientFormId = clientForms[0]._id; // Select the first form
  } else {
    throw new Error('No client form available');
  }

  const client = {fields: {}, formId: clientFormId};
  client.fields[PredefinedCharacteristics['First Name']._uri.split('#')[1]] = partnerClientData.firstName;
  client.fields[PredefinedCharacteristics['Last Name']._uri.split('#')[1]] = partnerClientData.lastName;
  client.fields[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = partnerClientData.id;
  if (method === 'POST') {
    return GDBClientModel(await createSingleGenericHelper(client, 'client'));
  } else {
    await (await updateSingleGenericHelper(originalId, client, 'client')).save();
    return null;
  }
}

async function receiveReferral(req, res, next) {
  try {
    const partnerData = req.body;

    const referralForms = await getDynamicFormsByFormTypeHelper('referral');
    if (referralForms.length > 0) {
      var referralFormId = referralForms[0]._id; // Select the first form
    } else {
      return res.status(400).json({message: 'No referral form available'});
    }

    if (Object.keys(PredefinedCharacteristics).length == 0) {
      await initPredefinedCharacteristics();
    }
    console.log(JSON.stringify(PredefinedCharacteristics));

    const referrer = await GDBOrganizationModel.findOne({endpointUrl: req.headers.referer});
    if (!referrer) {
      throw new Error("Could not find partner organization with the same endpoint URL as the referrer");
    }
    const referrerServiceProvider = await GDBServiceProviderModel.findOne({organization: referrer});

    const homeOrganization = await GDBOrganizationModel.findOne({status: 'Home'}, {populates: ['characteristicOccurrences.occurrenceOf']});
    if (!homeOrganization) {
      throw new Error('This deployment has no home organization');
    }
    const homeServiceProvider = await GDBServiceProviderModel.findOne({organization: homeOrganization});

    const myApiKey = req.header('X-MY-API-KEY');
    if (myApiKey !== homeOrganization.apiKey) {
      return res.status(403).json({message: 'API key is incorrect'});
    }

    const referral = {fields: {}, formId: referralFormId};
    referral.fields[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = partnerData.id;
    referral.fields[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]] = homeServiceProvider._uri;
    referral.fields[PredefinedInternalTypes['referringServiceProviderForReferral']._uri.split('#')[1]] = referrerServiceProvider._uri;
    referral.fields[PredefinedInternalTypes['programForReferral']._uri.split('#')[1]] = partnerData.program ? 'http://snmi#program_' + partnerData.program?.id : null;
    referral.fields[PredefinedInternalTypes['serviceForReferral']._uri.split('#')[1]] = partnerData.service ? 'http://snmi#service_' + partnerData.service?.id : null;
    if (req.method === 'POST') {
      referral.fields[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]] = await getClient(partnerData.client, req.method);
      await GDBReferralModel(await createSingleGenericHelper(referral, 'referral')).save();
    } else {
      const originalReferral = await GDBReferralModel.findOne({idInPartnerDeployment: partnerData.id},
        {populates: ['characteristicOccurrences.occurrenceOf.implementation', 'questionOccurrences']});
      await getClient(partnerData.client, req.method, originalReferral.client?.split('_')[1]);
      await (await updateSingleGenericHelper(originalReferral._id, referral, 'referral')).save();
    }

    return res.status(200).json({success: true});
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: e?.message});
  }
}

module.exports = {
  sendReferral,
  receiveReferral,
};
