const {
  GDBClientModel, GDBServiceProviderModel
} = require("../../models");
const {GDBProgramModel} = require("../../models/program/program");
const {GDBServiceModel} = require("../../models/service/service");
const {GDBOrganizationModel} = require("../../models/organization");
const {GDBReferralModel} = require("../../models/referral");
const {createSingleGenericHelper, fetchSingleGenericHelper, updateSingleGenericHelper} = require("../genericData");
const {initPredefinedCharacteristics, PredefinedCharacteristics,
  PredefinedInternalTypes} = require("../characteristics");
const {getProviderById} = require("../genericData/serviceProvider");
const {getDynamicFormsByFormTypeHelper, getIndividualsInClass} = require("../dynamicForm");
const {getGenericAssets} = require("./index");
const {createNotificationHelper} = require("../notification/notification");
const {sanitize} = require("../../helpers/sanitizer");
const {regexBuilder} = require("graphdb-utils");

/**
 * Converts a referral generic into a format in which it can be sent to a partner deployment.
 * The referral's program/service is included only if it belongs to the partner organization receiving the referral.
 * @param {Object} referralGeneric 
 * @param {number} receiverId The ID of the partner organization that is to receive the referral
 * @returns {Promise<Object>} The referral with characteristic/internal type labels mapping to characteristics/internal
 *     types.
 */
async function populateReferral(referralGeneric, receiverId) {
  const referralStatuses = await getIndividualsInClass(':ReferralStatus');
  const referral = {};

  referral.idInPartnerDeployment
    = referralGeneric[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]];
  referral.status = referralStatuses[referralGeneric[PredefinedCharacteristics['Referral Status']._uri.split('#')[1]]];

  const programUri = referralGeneric[PredefinedInternalTypes['programForReferral']._uri.split('#')[1]]
    || referralGeneric.program;
  if (programUri) {
    const programGeneric = await GDBProgramModel.findByUri(programUri,
      {populates: ['characteristicOccurrences.occurrenceOf']});
    if (programGeneric.serviceProvider?.split('_')[1] == receiverId) {
      referral.program = (await getGenericAssets([programGeneric], {
          'ID in Partner Deployment': 'id',
        }, []))[0];
    }
  }

  const serviceUri = referralGeneric[PredefinedInternalTypes['serviceForReferral']._uri.split('#')[1]]
    || referralGeneric.service;
  if (serviceUri) {
    const serviceGeneric = await GDBServiceModel.findByUri(serviceUri,
      {populates: ['characteristicOccurrences.occurrenceOf']});
    if (serviceGeneric.serviceProvider?.split('_')[1] == receiverId) {
      referral.service = (await getGenericAssets([serviceGeneric], {
          'ID in Partner Deployment': 'id',
        }, []))[0];
    }
  }

  const clientUri = referralGeneric[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]]
    || referralGeneric.client;
  if (clientUri) {
    const clientGeneric = await GDBClientModel.findByUri(clientUri,
      {populates: ['characteristicOccurrences.occurrenceOf']});
    referral.client = (await getGenericAssets([clientGeneric], {
        'First Name': 'firstName',
        'Last Name': 'lastName'
      }, [
        {key: 'id', value: '_id'}
      ]))[0];
  }

  return referral;
}

/**
 * If the given referral's receiver or referrer is a partner organization, returns the partner.
 * Otherwise, returns null.
 * @param {Object} referralGeneric 
 * @returns {Promise<Object|null>} The partner organization, if any, that is the referral's receiver or referrer,
 *     along with a property isReceiver.
 */
async function getReferralPartnerGeneric(referralGeneric) {
  // Get the referral's receiver
  const receiverId = (
    referralGeneric[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]]
    || referralGeneric.receivingServiceProvider)?.split('_')[1];
  if (!receiverId) {
    return null;
  }

  const receivingProvider = await getProviderById(receiverId);
  const receivingProviderType = receivingProvider.type;
  if (receivingProviderType !== 'organization') {
    return null;
  }
  const receiverGenericId = receivingProvider[receivingProviderType]._id;
  const receiverGeneric = await fetchSingleGenericHelper(receivingProviderType, receiverGenericId);

  // Get the referral's referrer
  const referrerId = (
    referralGeneric[PredefinedInternalTypes['referringServiceProviderForReferral']._uri.split('#')[1]]
    || referralGeneric.referringServiceProvider)?.split('_')[1];
  if (!referrerId) {
    return null;
  }

  const referringProvider = await getProviderById(referrerId);
  const referringProviderType = referringProvider.type;
  if (referringProviderType !== 'organization') {
    return null;
  }
  const referrerGenericId = referringProvider[referringProviderType]._id;
  const referrerGeneric = await fetchSingleGenericHelper(referringProviderType, referrerGenericId);

  let partnerGeneric;
  if (receiverGeneric[PredefinedCharacteristics['Organization Status']._uri.split('#')[1]] === 'Partner') {
    partnerGeneric = { ...receiverGeneric, isReceiver: true };
  } else if (referrerGeneric[PredefinedCharacteristics['Organization Status']._uri.split('#')[1]] === 'Partner') {
    partnerGeneric = { ...referrerGeneric, isReceiver: false };
  } else {
    return null;
  }

  return partnerGeneric;
}

/**
 * Sends the referral with the given id to its partner organization (as defined by getReferralPartnerGeneric).
 */
async function sendReferral(req, res, next) {
  try {
    const id = req.params.id;

    let referralGeneric;
    if (id != null) {
      try {
        referralGeneric = await fetchSingleGenericHelper('referral', id);
      } catch (e) {
        return res.status(404).json({message: 'Referral not found' + (e.message ? ': ' + e.message : '')});
      }
    } else {
      return res.status(400).json({message: 'No id provided'});
    }

    const receiverId = (
      referralGeneric[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]]
      || referralGeneric.receivingServiceProvider)?.split('_')[1];
    if (!receiverId) {
      // This is a valid case (the referral is not meant to be sent)
      return res.status(200).json({success: true});
    }
  
    const partnerGeneric = await getReferralPartnerGeneric(referralGeneric);
    if (!partnerGeneric) {
      // This is a valid case (the referral is not meant to be sent)
      return res.status(200).json({success: true});
    }

    const referral = await populateReferral(referralGeneric, receiverId);
    referral.id = id;
    referral.partnerIsReceiver = partnerGeneric.isReceiver; // True iff we are sending to the referral's receiver

    const endpointUrl = partnerGeneric[PredefinedCharacteristics['Endpoint URL']._uri.split('#')[1]];
    const url = new URL('/public/partnerNetwork/referral/', endpointUrl.startsWith('http') ? endpointUrl
      : 'https://' + endpointUrl);
    url.port = partnerGeneric[PredefinedCharacteristics['Endpoint Port Number']._uri.split('#')[1]];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      signal: controller.signal,
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-RECEIVER-API-KEY': partnerGeneric[PredefinedCharacteristics['API Key']._uri.split('#')[1]],
        // Frontend hostname without http(s)://. i.e. `127.0.0.1`, `localhost`, `example.com`
        'Referer': new URL(req.headers.origin).hostname,
      },
      body: JSON.stringify(referral),
    });
    clearTimeout(timeout);

    if (response.status >= 400 && response.status < 600) {
      const json = await response.json();
      return res.status(400).json({message: 'Bad response from partner: ' + response.status + ': '
        + (json.message || JSON.stringify(json))});
    } else if (response.status === 201) {
      // This was a successful POST request
      // The partner returned the ID of the new referral in their response; save it as ID in Partner Deployment locally
      const json = await response.json();

      const newId = json.newId;
      referralGeneric[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = newId;

      const referralForms = await getDynamicFormsByFormTypeHelper('referral');
      let referralFormId;
      if (referralForms.length > 0) {
        referralFormId = referralForms[0]._id; // Select the first form
      } else {
        return res.status(400).json({message: 'No referral form available'});
      }

      const { generic } = await updateSingleGenericHelper(id,
        {fields: referralGeneric, formId: referralFormId}, 'referral');
      await generic.save();
    }

    return res.status(202).json({success: true, message: `Successfully sent a referral`});
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: e?.message});
  }
}

/**
 * Converts the given partnerClientData into a format that can be saved.
 * If isNew is true, the client data is returnedd as a Client object that can be saved.
 * If isNew is false, the Client with ID originalId is updated using the client data.
 * @param {Object} partnerClientData - Client data from the partner
 * @param {boolean} isNew - Whether a client is to be created (true) or updated (false) with the given data
 * @param {number} [originalId] - The ID of the client to be updated if not isNew
 * @returns the new client object if isNew; else null.
 */
async function getClient(partnerClientData, isNew, originalId) {
  const clientForms = await getDynamicFormsByFormTypeHelper('client');
  let clientFormId;
  if (clientForms.length > 0) {
    clientFormId = clientForms[0]._id; // Select the first form
  } else {
    throw new Error('No client form available');
  }

  const client = {fields: {}, formId: clientFormId};
  client.fields[PredefinedCharacteristics['First Name']._uri.split('#')[1]] = partnerClientData.firstName;
  client.fields[PredefinedCharacteristics['Last Name']._uri.split('#')[1]] = partnerClientData.lastName;
  client.fields[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = partnerClientData.id;
  if (isNew) {
    return GDBClientModel(await createSingleGenericHelper(client, 'client'));
  } else {
    if (!!originalId) {
      const { generic } = await updateSingleGenericHelper(originalId, client, 'client');
      await generic.save();
    }
    return null;
  }
}

/**
 * Given partner referral data, returns the data in a format that can be saved locally, as well as
 * the original referral object which the referral data is updating, if applicable; the same
 * original referral in JSON format; and the partner organization sending the data.
 */
async function receiveReferralHelper(req, partnerData) {
  const referralForms = await getDynamicFormsByFormTypeHelper('referral');
  let referralFormId;
  if (referralForms.length > 0) {
    referralFormId = referralForms[0]._id; // Select the first form
  } else {
    throw new Error('No referral form available');
  }

  if (Object.keys(PredefinedCharacteristics).length === 0) {
    await initPredefinedCharacteristics();
  }

  // Use the "Referer" header to identify the partner organization who sent the data
  const partnerServiceProvider = await GDBServiceProviderModel.findOne({
    organization: {
      endpointUrl: {$regex: regexBuilder(`(https?://)?${req.headers.referer}`)}
    }
  }, {populates: ['organization']});
  const partner = partnerServiceProvider.organization;
  if (!partner) {
    throw new Error('Could not find partner organization with the same endpoint URL as the sender');
  }

  const homeServiceProvider = await GDBServiceProviderModel.findOne({'organization': {status: 'Home'}},
      {populates: ['organization.characteristicOccurrences.occurrenceOf']});
  const homeOrganization = homeServiceProvider?.organization;
  if (!homeServiceProvider) {
    throw new Error('This deployment has no home organization');
  }

  const receiverApiKey = req.header('X-RECEIVER-API-KEY');
  if (receiverApiKey !== homeOrganization.apiKey) {
    const error = new Error('API key is incorrect');
    error.name = '403 Forbidden';
    throw error;
  }

  // Determine which of the partner and home organizations is the receiver and which is the referrer
  let receivingServiceProvider = partnerData.partnerIsReceiver ? homeServiceProvider : partnerServiceProvider;
  let referringServiceProvider = partnerData.partnerIsReceiver ? partnerServiceProvider : homeServiceProvider;

  const originalReferral = await GDBReferralModel.findOne({idInPartnerDeployment: partnerData.id},
    {populates: ['characteristicOccurrences.occurrenceOf.implementation', 'questionOccurrences',
      'receivingServiceProvider', 'referringServiceProvider', 'program', 'service', 'address']});

  // Convert the locally existing referral (if any) to an object with characteristics as key-value pairs
  // instead of a list of characteristicOccurrences
  const originalReferralJson = originalReferral?.toJSON() || {};
  (originalReferralJson.characteristicOccurrences || []).forEach(characteristicOccurrence => {
    originalReferralJson[(characteristicOccurrence.occurrenceOf._uri
      || characteristicOccurrence.occurrenceOf).split('#')[1]]
        = characteristicOccurrence.dataStringValue || characteristicOccurrence.dataNumberValue
          || characteristicOccurrence.dataBooleanValue || characteristicOccurrence.dataDateValue
          || characteristicOccurrence.dataObjectValue || null;
  });
  delete originalReferralJson.characteristicOccurrences;
  delete originalReferralJson._id;
  if (!!originalReferralJson.address)
    originalReferralJson[PredefinedCharacteristics['Address']._uri.split('#')[1]] = originalReferralJson.address;

  // URIs of possible referral statuses
  const referralStatuses = await getIndividualsInClass(':ReferralStatus');

  const referral = {fields: originalReferralJson || {}, formId: referralFormId};
  if ('id' in partnerData)
    referral.fields[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = partnerData.id;
  if ('status' in partnerData)
    referral.fields[PredefinedCharacteristics['Referral Status']._uri.split('#')[1]]
      = Object.keys(referralStatuses).find(key => referralStatuses[key] === partnerData.status) || null;
  if (partnerData.partnerIsReceiver) {
    referral.fields[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]]
      = receivingServiceProvider._uri;
    referral.fields[PredefinedInternalTypes['referringServiceProviderForReferral']._uri.split('#')[1]]
      = referringServiceProvider._uri;
    if ('program' in partnerData)
      referral.fields[PredefinedInternalTypes['programForReferral']._uri.split('#')[1]]
        = 'http://snmi#program_' + partnerData.program.id;
    if ('service' in partnerData)
      referral.fields[PredefinedInternalTypes['serviceForReferral']._uri.split('#')[1]]
        = 'http://snmi#service_' + partnerData.service.id;
  }

  return {referral, originalReferral, originalReferralJson, partner};
}

/**
 * Saves the given partner data as a new referral.
 */
async function receiveNewReferral(req, res, next) {
  try {
    // Note, partnerData.partnerIsReceiver is true iff we are the referral's receiver
    const partnerData = req.body;

    const {referral, partner} = await receiveReferralHelper(req, partnerData);

    if (!partnerData.partnerIsReceiver) {
      return res.status(400).json({success: false, message: 'For a POST request, partnerIsReceiver must be true'});
    }

    referral.fields[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]]
      = await getClient(partnerData.client, true);
    const newReferral = GDBReferralModel(await createSingleGenericHelper(referral, 'referral'));
    await newReferral.save();

    // Notify the user of the new referral
    createNotificationHelper({
      name: 'A referral was received',
      description: `<a href="/providers/organization/${partner._id}">${sanitize(partner.name)}</a>, one of your `
        + `partner organizations, just sent you <a href="/referrals/${newReferral._id}">a new referral</a>.`
    });

    return res.status(201).json({success: true, newId: newReferral._id});
  } catch (e) {
    console.log(e);
    const code = parseInt(e.name.split(' ')[0]);
    if (code > 400 && code < 600) {
      return res.status(code).json({message: e?.message});
    } else {
      return res.status(400).json({message: e?.message});
    }
  }
}

/**
 * Saves the given partner data by updating an existing referral.
 */
async function receiveUpdatedReferral(req, res, next) {
  try {
    // Note, partnerData.partnerIsReceiver is true iff we are the referral's receiver
    const partnerData = req.body;

    const {referral, originalReferral, originalReferralJson, partner} = await receiveReferralHelper(req, partnerData);

    if (partnerData.partnerIsReceiver) {
      await getClient(partnerData.client, false, originalReferralJson.client?.split('_')[1]);
    } else {
      // Client stays the same
      referral.fields[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]]
        = originalReferral.receivingServiceProvider || null;
      referral.fields[PredefinedInternalTypes['referringServiceProviderForReferral']._uri.split('#')[1]]
        = originalReferral.referringServiceProvider || null;
      referral.fields[PredefinedInternalTypes['programForReferral']._uri.split('#')[1]]
        = originalReferral.program || null;
      referral.fields[PredefinedInternalTypes['serviceForReferral']._uri.split('#')[1]]
        = originalReferral.service || null;
    }
    const { generic } = await updateSingleGenericHelper(originalReferral._id, referral, 'referral');
    await generic.save();

    // Notify the user of the updated referral
    createNotificationHelper({
      name: 'A referral was updated',
      description: `<a href="/providers/organization/${partner._id}">${sanitize(partner.name)}</a>, one of your `
      + `partner organizations, just updated <a href="/referrals/${originalReferral._id}">this referral</a>.`
    });

    return res.status(200).json({success: true});
  } catch (e) {
    console.log(e);
    const code = parseInt(e.name.split(' ')[0]);
    if (code > 400 && code < 600) {
      return res.status(code).json({message: e?.message});
    } else {
      return res.status(400).json({message: e?.message});
    }
  }
}

module.exports = {
  sendReferral,
  receiveNewReferral,
  receiveUpdatedReferral,
  getClient,
  getReferralPartnerGeneric,
};
