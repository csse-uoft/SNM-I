const { GDBClientModel } = require("../../models");
const { GDBOrganizationModel } = require("../../models/organization");
const { GDBAppointmentModel } = require("../../models/appointment");
const { createSingleGenericHelper, fetchSingleGenericHelper, updateSingleGenericHelper } = require("../genericData");
const { initPredefinedCharacteristics, PredefinedCharacteristics, PredefinedInternalTypes } = require("../characteristics");
const { getProviderById } = require("../genericData/serviceProvider");
const { getDynamicFormsByFormTypeHelper } = require("../dynamicForm");
const { getGenericAsset } = require("./index");
const { GDBReferralModel } = require("../../models/referral");
const { getClient } = require("./referrals");
const { createNotificationHelper } = require("../notification/notification");
const { sanitize } = require("../../helpers/sanitizer");

async function populateAppointment(appointmentGeneric, receiverId) {
  const appointment = {};

  appointment.idInPartnerDeployment = appointmentGeneric[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]];
  appointment.name = appointmentGeneric[PredefinedCharacteristics['Appointment Name']._uri.split('#')[1]];
  appointment.datetime = appointmentGeneric[PredefinedCharacteristics['Date and Time']._uri.split('#')[1]];
  appointment.status = appointmentGeneric[PredefinedCharacteristics['Appointment Status']._uri.split('#')[1]];

  const referralId = parseInt((appointmentGeneric[PredefinedInternalTypes['referralForAppointment']._uri.split('#')[1]] || appointmentGeneric.referral)?.split('_')[1]);
  if (!!referralId) {
    const referralGeneric = await GDBReferralModel.findOne({ _id: referralId },
      { populates: ['characteristicOccurrences.occurrenceOf'] });
    appointment.referral = (await getGenericAsset([referralGeneric], {
      'ID in Partner Deployment': 'id',
    }, []))[0];
  }

  const clientId = parseInt((appointmentGeneric[PredefinedInternalTypes['clientForAppointment']._uri.split('#')[1]] || appointmentGeneric.client)?.split('_')[1]);
  if (!!clientId) {
    const clientGeneric = await GDBClientModel.findOne({ _id: clientId },
      { populates: ['characteristicOccurrences.occurrenceOf'] });
    appointment.client = (await getGenericAsset([clientGeneric], {
      'First Name': 'firstName',
      'Last Name': 'lastName'
    }, [
      { key: 'id', value: '_id' }
    ]))[0];
  }

  return appointment;
}

async function sendAppointment(req, res, next) {
  try {
    const id = req.params.id;

    let appointmentGeneric;
    if (!!id) {
      try {
        appointmentGeneric = await fetchSingleGenericHelper('appointment', id);
      } catch (e) {
        return res.status(404).json({ message: 'Appointment not found' + (e.message ? ': ' + e.message : '') });
      }
    } else {
      return res.status(400).json({ message: 'No id provided' });
    }

    const referralId = parseInt((appointmentGeneric[PredefinedInternalTypes['referralForAppointment']._uri.split('#')[1]] || appointmentGeneric.referral)?.split('_')[1]);
    const referralGeneric = await fetchSingleGenericHelper('referral', referralId);

    const receiverId = parseInt((referralGeneric[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]] || referralGeneric.receivingServiceProvider)?.split('_')[1]);
    if (!receiverId || isNaN(receiverId)) {
      return res.status(200).json({ success: true, message: 'Receiving service provider for appointment\'s referral not found' });
    }

    const referrerId = parseInt((referralGeneric[PredefinedInternalTypes['referringServiceProviderForReferral']._uri.split('#')[1]] || referralGeneric.referringServiceProvider)?.split('_')[1]);
    if (!referrerId || isNaN(referrerId)) {
      return res.status(200).json({ success: true, message: 'Referring service provider for appointment\'s referral not found' });
    }

    let receiverGeneric;
    let referrerGeneric;
    let partnerGeneric;
    try {
      const receivingProvider = await getProviderById(receiverId);
      const receivingProviderType = receivingProvider.type;
      if (receivingProviderType !== 'organization') {
        return res.status(200).json({ success: true, message: 'Receiving service provider is not an organization' });
      }
      const receiverGenericId = receivingProvider[receivingProviderType]._id;
      receiverGeneric = await fetchSingleGenericHelper(receivingProviderType, receiverGenericId);

      const referringProvider = await getProviderById(referrerId);
      const referringProviderType = referringProvider.type;
      if (referringProviderType !== 'organization') {
        return res.status(200).json({ success: true, message: 'Referring service provider is not an organization' });
      }
      const referrerGenericId = referringProvider[referringProviderType]._id;
      referrerGeneric = await fetchSingleGenericHelper(referringProviderType, referrerGenericId);

      if (receiverGeneric[PredefinedCharacteristics['Organization Status']._uri.split('#')[1]] === 'Partner') {
        partnerGeneric = { ...receiverGeneric, isReceiver: true };
      } else if (referrerGeneric[PredefinedCharacteristics['Organization Status']._uri.split('#')[1]] === 'Partner') {
        partnerGeneric = { ...referrerGeneric, isReceiver: false };
      } else {
        return res.status(200).json({ success: true, message: 'Neither receiving nor referring service provider is a partner organization' });
      }
    } catch (e) {
      return res.status(404).json({ message: 'Service provider for appointment\'s referral not found' + (e.message ? ': ' + e.message : '') });
    }

    const appointment = await populateAppointment(appointmentGeneric, receiverId);
    appointment.id = id;
    appointment.partnerIsReceiver = partnerGeneric.isReceiver;

    const endpointUrl = partnerGeneric[PredefinedCharacteristics['Endpoint URL']._uri.split('#')[1]];
    const url = new URL('/public/partnerNetwork/appointment/', endpointUrl.startsWith('http') ? endpointUrl : 'https://' + endpointUrl);
    url.port = partnerGeneric[PredefinedCharacteristics['Endpoint Port Number']._uri.split('#')[1]];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      signal: controller.signal,
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-MY-API-KEY': partnerGeneric[PredefinedCharacteristics['API Key']._uri.split('#')[1]],
        'Referer': req.headers.host,
      },
      body: JSON.stringify(appointment),
    });
    clearTimeout(timeout);

    if (response.status >= 400 && response.status < 600) {
      const json = await response.json();
      return res.status(400).json({ message: 'Bad response from partner: ' + response.status + ': ' + (json.message || JSON.stringify(json)) });
    } else if (response.status === 201) {
      const json = await response.json();

      // This was a successful POST request
      const newId = json.newId;
      appointmentGeneric[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = newId;

      const appointmentForms = await getDynamicFormsByFormTypeHelper('appointment');
      if (appointmentForms.length > 0) {
        var appointmentFormId = appointmentForms[0]._id; // Select the first form
      } else {
        return res.status(400).json({ message: 'No appointment form available' });
      }

      await (await updateSingleGenericHelper(id, { fields: appointmentGeneric, formId: appointmentFormId }, 'appointment')).save();
    }

    return res.status(202).json({ success: true, message: `Successfully sent a appointment` });
  } catch (e) {
    return res.status(400).json({ message: e?.message });
  }
}

async function receiveAppointment(req, res, next) {
  try {
    const partnerData = req.body;

    const appointmentForms = await getDynamicFormsByFormTypeHelper('appointment');
    if (appointmentForms.length > 0) {
      var appointmentFormId = appointmentForms[0]._id; // Select the first form
    } else {
      return res.status(400).json({ message: 'No appointment form available' });
    }

    if (Object.keys(PredefinedCharacteristics).length == 0) {
      await initPredefinedCharacteristics();
    }
    console.log(JSON.stringify(PredefinedCharacteristics));

    const partner = await GDBOrganizationModel.findOne({ endpointUrl: req.headers.referer });
    if (!partner || partner.endpointUrl !== req.headers.referer) {
      throw new Error("Could not find partner organization with the same endpoint URL as the sender");
    }

    const homeOrganization = await GDBOrganizationModel.findOne({ status: 'Home' }, { populates: ['characteristicOccurrences.occurrenceOf'] });
    if (!homeOrganization) {
      throw new Error('This deployment has no home organization');
    }

    const myApiKey = req.header('X-MY-API-KEY');
    if (myApiKey !== homeOrganization.apiKey) {
      return res.status(403).json({ message: 'API key is incorrect' });
    }

    const originalAppointment = await GDBAppointmentModel.findOne({ idInPartnerDeployment: partnerData.id },
      { populates: ['characteristicOccurrences', 'questionOccurrences'] });
    const originalAppointmentJson = originalAppointment?.toJSON() || {};
    originalAppointmentJson.characteristicOccurrences?.forEach(characteristicOccurrence => {
      originalAppointmentJson[characteristicOccurrence.occurrenceOf.split('#')[1]] = characteristicOccurrence.dataStringValue || characteristicOccurrence.dataNumberValue || characteristicOccurrence.dataBooleanValue || characteristicOccurrence.dataDateValue || null;
    });
    delete originalAppointmentJson.characteristicOccurrences;
    delete originalAppointmentJson._id;

    const appointment = { fields: originalAppointmentJson || {}, formId: appointmentFormId };
    'id' in partnerData && (appointment.fields[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = partnerData.id);
    'name' in partnerData && (appointment.fields[PredefinedCharacteristics['Appointment Name']._uri.split('#')[1]] = partnerData.name);
    'datetime' in partnerData && (appointment.fields[PredefinedCharacteristics['Date and Time']._uri.split('#')[1]] = partnerData.datetime);
    'status' in partnerData && (appointment.fields[PredefinedCharacteristics['Appointment Status']._uri.split('#')[1]] = partnerData.status);
    if (partnerData.partnerIsReceiver) {
      if (!(partnerData.referral?.id)) {
        return res.status(400).json({ message: "No referral ID provided" });
      }
      'referral' in partnerData && (appointment.fields[PredefinedInternalTypes['referralForAppointment']._uri.split('#')[1]] = partnerData.referral ? 'http://snmi#referral_' + partnerData.referral?.id : null);
    }

    if (req.method === 'POST') { // partnerData.partnerIsReceiver must be true here
      const referralGeneric = await fetchSingleGenericHelper('referral', partnerData.referral?.id);
      await getClient(partnerData.client, false, referralGeneric[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]]?.split('_')[1]);
      appointment.fields[PredefinedInternalTypes['clientForAppointment']._uri.split('#')[1]] = referralGeneric[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]] || null;

      const newAppointment = GDBAppointmentModel(await createSingleGenericHelper(appointment, 'appointment'));
      await newAppointment.save();

      createNotificationHelper({
        name: 'An appointment was received',
        description: `<a href="/providers/organization/${partner._id}">${sanitize(partner.name)}</a>, one of your partner organizations, just sent you <a href="/appointments/${newAppointment._id}">a new appointment</a>.`
      });

      return res.status(201).json({ success: true, newId: newAppointment._id });
    } else {
      if (partnerData.partnerIsReceiver) {
        await getClient(partnerData.client, req.method === 'POST', originalAppointmentJson.client?.split('_')[1]);
      } else {
        // Only the ID in Partner Deployment and Appointment Status are taken from the partner; other fields stay the same
        appointment.fields[PredefinedInternalTypes['referralForAppointment']._uri.split('#')[1]] = originalAppointmentJson.referral || null;
      }
      await (await updateSingleGenericHelper(originalAppointment._id, appointment, 'appointment')).save();

      createNotificationHelper({
        name: 'An appointment was updated',
        description: `<a href="/providers/organization/${partner._id}">${sanitize(partner.name)}</a>, one of your partner organizations, just updated the status of <a href="/appointments/${originalAppointment._id}">this appointment</a>.`
      });

      return res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e?.message });
  }
}

module.exports = {
  sendAppointment,
  receiveAppointment,
};
