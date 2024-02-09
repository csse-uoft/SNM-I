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
const {getDynamicFormsByFormTypeHelper, getIndividualsInClass} = require("../dynamicForm");
const {getGenericAsset} = require("./index");
const {createNotificationHelper} = require("../notification/notification");
const {sanitize} = require("../../helpers/sanitizer");

/**
 * Converts a referral generic into a format in which it can be sent to a partner deployment.
 * The referral's program/service is included only if it belongs to the partner organization receiving the referral.
 * @param {Object} referralGeneric 
 * @param {number} receiverId The ID of the partner organization that is to receive the referral
 * @returns {Object} The referral with characteristic/internal type labels mapping to characteristics/internal types.
 */
async function populateReferral(referralGeneric, receiverId) {
  const referralStatuses = await getIndividualsInClass(':ReferralStatus');
  const referral = {};

  referral.idInPartnerDeployment = referralGeneric[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]];
  referral.status = referralStatuses[referralGeneric[PredefinedCharacteristics['Referral Status']._uri.split('#')[1]]];

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

/**
 * If the given referral's receiver or referrer is a partner organization, return the partner
 * @param {Object} referralGeneric 
 * @returns {Object|null} The partner organization, if any, that is the referral's receiver or referrer,
 * along with a property isReceiver.
 */
async function getReferralPartnerGeneric(referralGeneric) {
  // Get the referral's receiver
  const receiverId = parseInt((referralGeneric[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]] || referralGeneric.receivingServiceProvider)?.split('_')[1]);
  if (!receiverId || isNaN(receiverId)) {
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
  const referrerId = parseInt((referralGeneric[PredefinedInternalTypes['referringServiceProviderForReferral']._uri.split('#')[1]] || referralGeneric.referringServiceProvider)?.split('_')[1]);
  if (!referrerId || isNaN(referrerId)) {
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
      // This is a valid case (the referral is not meant to be sent)
      return res.status(200).json({success: true});
    }
  
    const partnerGeneric = getReferralPartnerGeneric(referralGeneric);
    if (!partnerGeneric) {
      // This is a valid case (the referral is not meant to be sent)
      return res.status(200).json({success: true});
    }

    const referral = await populateReferral(referralGeneric, receiverId);
    referral.id = id;
    referral.partnerIsReceiver = partnerGeneric.isReceiver; // True iff we are sending to the referral's receiver

    const endpointUrl = partnerGeneric[PredefinedCharacteristics['Endpoint URL']._uri.split('#')[1]];
    const url = new URL('/public/partnerNetwork/referral/', endpointUrl.startsWith('http') ? endpointUrl : 'https://' + endpointUrl);
    url.port = partnerGeneric[PredefinedCharacteristics['Endpoint Port Number']._uri.split('#')[1]];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      signal: controller.signal,
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-RECEIVER-API-KEY': partnerGeneric[PredefinedCharacteristics['API Key']._uri.split('#')[1]],
        'Referer': req.headers.host,
      },
      body: JSON.stringify(referral),
    });
    clearTimeout(timeout);

    if (response.status >= 400 && response.status < 600) {
      const json = await response.json();
      return res.status(400).json({message: 'Bad response from partner: ' + response.status + ': ' + (json.message || JSON.stringify(json))});
    } else if (response.status === 201) {
      // This was a successful POST request
      // The partner returned the ID of the new referral in their response; save it as ID in Partner Deployment locally
      const json = await response.json();

      const newId = json.newId;
      referralGeneric[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = newId;

      const referralForms = await getDynamicFormsByFormTypeHelper('referral');
      if (referralForms.length > 0) {
        var referralFormId = referralForms[0]._id; // Select the first form
      } else {
        return res.status(400).json({message: 'No referral form available'});
      }

      await (await updateSingleGenericHelper(id, {fields: referralGeneric, formId: referralFormId}, 'referral')).save();
    }

    return res.status(202).json({success: true, message: `Successfully sent a referral`});
  } catch (e) {
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
  if (clientForms.length > 0) {
    var clientFormId = clientForms[0]._id; // Select the first form
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
    !!originalId && await (await updateSingleGenericHelper(originalId, client, 'client')).save();
    return null;
  }
}

/**
 * Save the given partner data as a referral (creating a new referral if the request method is POST,
 * or updating an referral if the request method is PUT).
 */
async function receiveReferral(req, res, next) {
  try {
    // Note, partnerData.partnerIsReceiver is true iff we are the referral's receiver
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

    // Use the "Referer" header to identify the partner organization who sent the data
    const partner = await GDBOrganizationModel.findOne({endpointUrl: req.headers.referer});
    if (!partner || partner.endpointUrl !== req.headers.referer) {
      throw new Error("Could not find partner organization with the same endpoint URL as the sender");
    }
    const partnerServiceProvider = await GDBServiceProviderModel.findOne({organization: partner});

    const homeOrganization = await GDBOrganizationModel.findOne({status: 'Home'}, {populates: ['characteristicOccurrences.occurrenceOf']});
    if (!homeOrganization) {
      throw new Error('This deployment has no home organization');
    }
    const homeServiceProvider = await GDBServiceProviderModel.findOne({organization: homeOrganization});

    const receiverApiKey = req.header('X-RECEIVER-API-KEY');
    if (receiverApiKey !== homeOrganization.apiKey) {
      return res.status(403).json({message: 'API key is incorrect'});
    }

    // Determine which of the partner and home organizations is the receiver and which is the referrer
    var receivingServiceProvider = partnerData.partnerIsReceiver ? homeServiceProvider : partnerServiceProvider;
    var referringServiceProvider = partnerData.partnerIsReceiver ? partnerServiceProvider : homeServiceProvider;

    const originalReferral = await GDBReferralModel.findOne({idInPartnerDeployment: partnerData.id},
      {populates: ['characteristicOccurrences.occurrenceOf.implementation', 'questionOccurrences', 'receivingServiceProvider', 'referringServiceProvider', 'program', 'service']});

    // Convert the locally existing referral (if any) to an object with characteristics as key-value pairs
    // instead of a list of characteristicOccurrences
    const originalReferralJson = originalReferral?.toJSON() || {};
    (originalReferralJson.characteristicOccurrences || []).forEach(characteristicOccurrence => {
      originalReferralJson[(characteristicOccurrence.occurrenceOf._uri || characteristicOccurrence.occurrenceOf).split('#')[1]] = characteristicOccurrence.dataStringValue || characteristicOccurrence.dataNumberValue || characteristicOccurrence.dataBooleanValue || characteristicOccurrence.dataDateValue || null;
    });
    delete originalReferralJson.characteristicOccurrences;
    delete originalReferralJson._id;

    // URIs of possible referral statuses
    const referralStatuses = await getIndividualsInClass(':ReferralStatus');

    const referral = {fields: originalReferralJson || {}, formId: referralFormId};
    'id' in partnerData && (referral.fields[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = partnerData.id);
    'status' in partnerData && (referral.fields[PredefinedCharacteristics['Referral Status']._uri.split('#')[1]] = Object.keys(referralStatuses).find(key => referralStatuses[key] === partnerData.status) || null);
    if (partnerData.partnerIsReceiver) {
      referral.fields[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]] = receivingServiceProvider._uri;
      referral.fields[PredefinedInternalTypes['referringServiceProviderForReferral']._uri.split('#')[1]] = referringServiceProvider._uri;
      'program' in partnerData && (referral.fields[PredefinedInternalTypes['programForReferral']._uri.split('#')[1]] = 'http://snmi#program_' + partnerData.program.id);
      'service' in partnerData && (referral.fields[PredefinedInternalTypes['serviceForReferral']._uri.split('#')[1]] = 'http://snmi#service_' + partnerData.service.id);
    }

    if (req.method === 'POST') {
      if (!partnerData.partnerIsReceiver) {
        return res.status(400).json({success: false, message: 'For a POST request, partnerIsReceiver must be true'});
      }

      referral.fields[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]] = await getClient(partnerData.client, req.method === 'POST');
      const newReferral = GDBReferralModel(await createSingleGenericHelper(referral, 'referral'));
      await newReferral.save();

      // Notify the user of the new referral
      createNotificationHelper({
        name: 'A referral was received',
        description: `<a href="/providers/organization/${partner._id}">${sanitize(partner.name)}</a>, one of your partner organizations, just sent you <a href="/referrals/${newReferral._id}">a new referral</a>.`
      });

      return res.status(201).json({success: true, newId: newReferral._id});
    } else {
      if (partnerData.partnerIsReceiver) {
        await getClient(partnerData.client, req.method === 'POST', originalReferralJson.client?.split('_')[1]);
      } else {
        // Client stays the same
        referral.fields[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]] = originalReferral.receivingServiceProvider || null;
        referral.fields[PredefinedInternalTypes['referringServiceProviderForReferral']._uri.split('#')[1]] = originalReferral.referringServiceProvider || null;
        referral.fields[PredefinedInternalTypes['programForReferral']._uri.split('#')[1]] = originalReferral.program || null;
        referral.fields[PredefinedInternalTypes['serviceForReferral']._uri.split('#')[1]] = originalReferral.service || null;
      }
      await (await updateSingleGenericHelper(originalReferral._id, referral, 'referral')).save();

      // Notify the user of the updated referral
      createNotificationHelper({
        name: 'A referral was updated',
        description: `<a href="/providers/organization/${partner._id}">${sanitize(partner.name)}</a>, one of your partner organizations, just updated <a href="/referrals/${originalReferral._id}">this referral</a>.`
      });

      return res.status(200).json({success: true});
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: e?.message});
  }
}

module.exports = {
  sendReferral,
  receiveReferral,
  getClient,
  getReferralPartnerGeneric,
};
