const {GDBClientModel, GDBServiceProviderModel} = require("../../models");
const {GDBOrganizationModel} = require("../../models/organization");
const {GDBAppointmentModel} = require("../../models/appointment");
const {createSingleGenericHelper, fetchSingleGenericHelper, updateSingleGenericHelper} = require("../genericData");
const {initPredefinedCharacteristics, PredefinedCharacteristics,
  PredefinedInternalTypes} = require("../characteristics");
const {getDynamicFormsByFormTypeHelper, getIndividualsInClass} = require("../dynamicForm");
const {getGenericAssets} = require("./index");
const {GDBReferralModel} = require("../../models/referral");
const {getClient, getReferralPartnerGeneric} = require("./referrals");
const {createNotificationHelper} = require("../notification/notification");
const {sanitize} = require("../../helpers/sanitizer");
const {regexBuilder} = require("graphdb-utils");

/**
 * Converts an appointment generic into a format in which it can be sent to a partner deployment
 * @param {Object} appointmentGeneric 
 * @returns {Promise<any>} The appointment with characteristic/internal type labels mapping to characteristics/internal
 *     types.
 */
async function populateAppointment(appointmentGeneric) {
  const appointmentStatuses = await getIndividualsInClass(':AppointmentStatus');
  const appointment = {};

  appointment.idInPartnerDeployment
    = appointmentGeneric[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]];
  appointment.name = appointmentGeneric[PredefinedCharacteristics['Appointment Name']._uri.split('#')[1]];
  appointment.datetime = appointmentGeneric[PredefinedCharacteristics['Date and Time']._uri.split('#')[1]];
  appointment.status = appointmentStatuses[appointmentGeneric[PredefinedCharacteristics['Appointment Status']._uri.split('#')[1]]];

  const referralUri = (appointmentGeneric[PredefinedInternalTypes['referralForAppointment']._uri.split('#')[1]]
    || appointmentGeneric.referral);
  if (referralUri) {
    const referralGeneric = await GDBReferralModel.findByUri(referralUri,
      { populates: ['characteristicOccurrences.occurrenceOf'] });
    appointment.referral = (await getGenericAssets([referralGeneric], {
      'ID in Partner Deployment': 'id',
    }, []))[0];
  }

  const clientUri = (appointmentGeneric[PredefinedInternalTypes['clientForAppointment']._uri.split('#')[1]]
    || appointmentGeneric.client);
  if (clientUri) {
    const clientGeneric = await GDBClientModel.findByUri(clientUri,
      { populates: ['characteristicOccurrences.occurrenceOf'] });
    appointment.client = (await getGenericAssets([clientGeneric], {
      'First Name': 'firstName',
      'Last Name': 'lastName'
    }, [
      { key: 'id', value: '_id' }
    ]))[0];
  }

  return appointment;
}

/**
 * If the appointment with the given id is associated with a referral, and that referral's
 * referring or receiving service provider is a partner organization, sends the appointment
 * to that partner. The method of the request sent to the partner is the method with which
 * this function is called (either PUT or POST).
 */
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

    const referralId = (
      appointmentGeneric[PredefinedInternalTypes['referralForAppointment']._uri.split('#')[1]]
      || appointmentGeneric.referral)?.split('_')[1];
    if (!referralId) {
      // This is a valid case (the appointment is not meant to be sent)
      return res.status(200).json({success: true});
    }
    const referralGeneric = await fetchSingleGenericHelper('referral', referralId);

    const partnerGeneric = await getReferralPartnerGeneric(referralGeneric);
    if (!partnerGeneric) {
      // This is a valid case (the appointment is not meant to be sent)
      return res.status(200).json({success: true});
    }

    const appointment = await populateAppointment(appointmentGeneric);
    appointment.id = id;
    appointment.partnerIsReceiver = partnerGeneric.isReceiver; // True iff we are sending to the appointment's referral's receiver

    const endpointUrl = partnerGeneric[PredefinedCharacteristics['Endpoint URL']._uri.split('#')[1]];
    const url = new URL('/public/partnerNetwork/appointment/', endpointUrl.startsWith('http') ? endpointUrl
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
      body: JSON.stringify(appointment),
    });
    clearTimeout(timeout);

    if (response.status >= 400 && response.status < 600) {
      const json = await response.json();
      return res.status(400).json({ message: 'Bad response from partner: ' + response.status + ': '
        + (json.message || JSON.stringify(json)) });
    } else if (response.status === 201) {
      // This was a successful POST request
      // The partner returned the ID of the new appointment in their response; save it as ID in Partner Deployment
      // locally
      const json = await response.json();

      const newId = json.newId;
      appointmentGeneric[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = newId;

      const appointmentForms = await getDynamicFormsByFormTypeHelper('appointment');
      let appointmentFormId;
      if (appointmentForms.length > 0) {
        appointmentFormId = appointmentForms[0]._id; // Select the first form
      } else {
        return res.status(400).json({ message: 'No appointment form available' });
      }

      const {generic} = await updateSingleGenericHelper(id,
        {fields: appointmentGeneric, formId: appointmentFormId}, 'appointment');
      await generic.save();
    }

    return res.status(202).json({ success: true, message: `Successfully sent a appointment` });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e?.message });
  }
}

/**
 * Given partner appointment data, returns the data in a format that can be saved locally, as well as
 * the original appointment object which the appointment data is updating, if applicable; the same
 * original appointment in JSON format; and the partner organization sending the data.
 */
async function receiveAppointmentHelper(req, partnerData) {
  const appointmentForms = await getDynamicFormsByFormTypeHelper('appointment');
  let appointmentFormId;
  if (appointmentForms.length > 0) {
    appointmentFormId = appointmentForms[0]._id; // Select the first form
  } else {
    throw new Error('No appointment form available');
  }

  if (Object.keys(PredefinedCharacteristics).length === 0) {
    await initPredefinedCharacteristics();
  }

  // Use the "Referer" header to identify the partner organization who sent the data
  const partner = await GDBServiceProviderModel.findOne({
    organization: {
      endpointUrl: {$regex: regexBuilder(`(https?://)?${req.headers.referer}`)}
    }
  }, {populates: ['organization']});
  const partnerOrganization = partner.organization;
  if (!partnerOrganization) {
    throw new Error("Could not find partner organization with the same endpoint URL as the sender");
  }

  const homeOrganization = await GDBOrganizationModel.findOne({ status: 'Home' },
    { populates: ['characteristicOccurrences.occurrenceOf'] });
  if (!homeOrganization) {
    throw new Error('This deployment has no home organization');
  }

  const receiverApiKey = req.header('X-RECEIVER-API-KEY');
  if (receiverApiKey !== homeOrganization.apiKey) {
    const error = new Error('API key is incorrect');
    error.name = '403 Forbidden';
    throw error;
  }

  const originalAppointment = await GDBAppointmentModel.findOne({ idInPartnerDeployment: partnerData.id },
    { populates: ['characteristicOccurrences', 'questionOccurrences', 'address'] });
  if (req.method === 'PUT' && (!originalAppointment || originalAppointment.idInPartnerDeployment != partnerData.id)) {
    const error = new Error('Appointment not found');
    error.name = '404 Not Found';
    throw error;
  }

  // Convert the locally existing appointment (if any) to an object with characteristics as key-value pairs
  // instead of a list of characteristicOccurrences
  const originalAppointmentJson = originalAppointment?.toJSON() || {};
  (originalAppointmentJson.characteristicOccurrences || []).forEach(characteristicOccurrence => {
    originalAppointmentJson[(characteristicOccurrence.occurrenceOf._uri
      || characteristicOccurrence.occurrenceOf).split('#')[1]]
        = characteristicOccurrence.dataStringValue || characteristicOccurrence.dataNumberValue
          || characteristicOccurrence.dataBooleanValue || characteristicOccurrence.dataDateValue
          || characteristicOccurrence.dataObjectValue || null;
  });
  delete originalAppointmentJson.characteristicOccurrences;
  delete originalAppointmentJson._id;
  if (!!originalAppointmentJson.address)
    originalAppointmentJson[PredefinedCharacteristics['Address']._uri.split('#')[1]]
      = originalAppointmentJson.address;

  // URIs of possible appointment statuses
  const appointmentStatuses = await getIndividualsInClass(':AppointmentStatus');

  const appointment = { fields: originalAppointmentJson || {}, formId: appointmentFormId };
  if ('id' in partnerData)
    appointment.fields[PredefinedCharacteristics['ID in Partner Deployment']._uri.split('#')[1]] = partnerData.id;
  if ('name' in partnerData)
    appointment.fields[PredefinedCharacteristics['Appointment Name']._uri.split('#')[1]] = partnerData.name;
  if ('datetime' in partnerData)
    appointment.fields[PredefinedCharacteristics['Date and Time']._uri.split('#')[1]] = partnerData.datetime;
  if ('status' in partnerData)
    appointment.fields[PredefinedCharacteristics['Appointment Status']._uri.split('#')[1]]
      = Object.keys(appointmentStatuses).find(key => appointmentStatuses[key] === partnerData.status) || null;
  if (partnerData.partnerIsReceiver) {
    if (!(partnerData.referral?.id)) {
      throw new Error('No referral ID provided');
    } else {
      appointment.fields[PredefinedInternalTypes['referralForAppointment']._uri.split('#')[1]]
        = 'http://snmi#referral_' + partnerData.referral?.id;
    }
  }

  return {appointment, originalAppointment, originalAppointmentJson, partner};
}

/**
 * Save the given partner data as a new appointment.
 */
async function receiveNewAppointment(req, res, next) {
  try {
    // Note, partnerData.partnerIsReceiver is true iff we are the appointment's referral's receiver
    const partnerData = req.body;

    const {appointment, partner} = await receiveAppointmentHelper(req, partnerData);

    if (!partnerData.partnerIsReceiver) {
      return res.status(400).json({success: false, message: 'For a POST request, partnerIsReceiver must be true'});
    }

    const referralGeneric = await fetchSingleGenericHelper('referral', partnerData.referral.id);
    await getClient(partnerData.client, false,
      referralGeneric[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]]?.split('_')[1]);
    appointment.fields[PredefinedInternalTypes['clientForAppointment']._uri.split('#')[1]]
      = referralGeneric[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]] || null;

    const newAppointment = GDBAppointmentModel(await createSingleGenericHelper(appointment, 'appointment'));
    await newAppointment.save();

    // Notify the user of the new appointment
    createNotificationHelper({
      name: 'An appointment was received',
      description: `<a href="/providers/organization/${partner._id}">${sanitize(partner.organization.name)}</a>, one `
      + `of your partner organizations, just sent you <a href="/appointments/${newAppointment._id}">a new `
      + `appointment</a>.`
    });

    return res.status(201).json({ success: true, newId: newAppointment._id });
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
 * Save the given partner data by updating an existing appointment.
 */
async function receiveUpdatedAppointment(req, res, next) {
  try {
    // Note, partnerData.partnerIsReceiver is true iff we are the appointment's referral's receiver
    const partnerData = req.body;

    const {appointment, originalAppointment, originalAppointmentJson, partner}
      = await receiveAppointmentHelper(req, partnerData);

    if (partnerData.partnerIsReceiver) {
      await getClient(partnerData.client, false, originalAppointmentJson.client?.split('_')[1]);
    } else {
      // Referral and client stay the same
      appointment.fields[PredefinedInternalTypes['referralForAppointment']._uri.split('#')[1]]
        = originalAppointmentJson.referral || null;
    }
    const {generic} = await updateSingleGenericHelper(originalAppointment._id, appointment, 'appointment');
    await generic.save();

    // Notify the user of the updated appointment
    createNotificationHelper({
      name: 'An appointment was updated',
      description: `<a href="/providers/organization/${partner._id}">${sanitize(partner.organization.name)}</a>, one `
      + `of your partner organizations, just updated <a href="/appointments/${originalAppointment._id}">this `
      + `appointment</a>.`
    });

    return res.status(200).json({ success: true });
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
  sendAppointment,
  receiveNewAppointment,
  receiveUpdatedAppointment,
};
