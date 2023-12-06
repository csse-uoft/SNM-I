const {
  GDBClientModel, GDBServiceProviderModel
} = require("../../models");
const {GDBProgramModel} = require("../../models/program/program");
const {GDBServiceModel} = require("../../models/service/service");
const {createSingleGenericHelper, fetchSingleGenericHelper, updateSingleGenericHelper,
  deleteSingleGenericHelper, fetchGenericDatasHelper} = require("../genericData");
const {findCharacteristicById, initPredefinedCharacteristics, PredefinedCharacteristics, PredefinedInternalTypes} = require("../characteristics");
const {getProviderById} = require("../genericData/serviceProvider");
const {getDynamicFormsByFormTypeHelper} = require("../dynamicForm");
const {getGenericAsset} = require("./index");

async function populateReferral(referralGeneric, receiverId) {
  const referral = {};

  const programId = parseInt(referralGeneric[PredefinedInternalTypes['programForReferral']._uri.split('#')[1]]?.split('_')[1]);
  if (!!programId) {
    const programGeneric = await GDBProgramModel.findOne({_id: programId},
      {populates: ['characteristicOccurrences.occurrenceOf']});
    if (programGeneric.serviceProvider?.split('_')[1] == receiverId) {
      referral.program = (await getGenericAsset([programGeneric], {
          'ID in Partner Deployment': 'id',
          'Program Name': 'programName',
          'Description': 'description',
          'Shareability': 'shareability',
          'Address': 'address'
        }, []))[0];
    }
  }

  const serviceId = parseInt(referralGeneric[PredefinedInternalTypes['serviceForReferral']._uri.split('#')[1]]?.split('_')[1]);
  if (!!serviceId) {
    const serviceGeneric = await GDBServiceModel.findOne({_id: serviceId},
      {populates: ['characteristicOccurrences.occurrenceOf']});
    if (serviceGeneric.serviceProvider?.split('_')[1] == receiverId) {
      referral.service = (await getGenericAsset([serviceGeneric], {
          'ID in Partner Deployment': 'id',
          'Service Name': 'serviceName',
          'Description': 'description',
          'Shareability': 'shareability',
          'Address': 'address'
        }, []))[0];
    }
  }

  const clientId = parseInt(referralGeneric[PredefinedInternalTypes['clientForReferral']._uri.split('#')[1]]?.split('_')[1]);
  if (!!clientId) {
    const clientGeneric = await GDBClientModel.findOne({_id: clientId},
      {populates: ['characteristicOccurrences.occurrenceOf']});
    referral.client = (await getGenericAsset([clientGeneric], {
        'First Name': 'firstName',
        'Last Name': 'lastName',
        'Description': 'description',
        'Address': 'address'
      }, []))[0];
  }

  return referral;
}

async function sendReferral(req, res, next) {
  try {
    const {id} = req.params;

    let referralGeneric;
    try {
      referralGeneric = await fetchSingleGenericHelper('referral', id);
    } catch (e) {
      return res.status(404).json({message: 'Referral not found' + (e.message ? ': ' + e.message : null)});
    }

    const receiverId = parseInt(referralGeneric[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]]?.split('_')[1]);
    if (!receiverId || isNaN(receiverId)) {
      return res.status(404).json({message: 'Receiving service provider for referral not found' + (e.message ? ': ' + e.message : null)});
    }

    const referral = await populateReferral(referralGeneric, receiverId);

    let receiverGeneric;
    try {
      const provider = await getProviderById(receiverId);
      const providerType = provider.type;
      if (providerType !== 'organization') {
        throw new Error('Receiving service provider is not an organization');
      }
      const genericId = provider[providerType]._id;
      receiverGeneric = await fetchSingleGenericHelper(providerType, genericId);
    } catch (e) {
      return res.status(404).json({message: 'Receiving organization not found' + (e.message ? ': ' + e.message : null)});
    }

    const url = new URL(receiverGeneric[PredefinedCharacteristics['Endpoint URL']._uri.split('#')[1]]);
    url.port = receiverGeneric[PredefinedCharacteristics['Endpoint Port Number']._uri.split('#')[1]];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'X-API-KEY': receiverGeneric[PredefinedCharacteristics['API Key']._uri.split('#')[1]],
      },
      body: JSON.stringify(referral),
    });
    clearTimeout(timeout);

    if (response.status >= 400 && response.status < 600) {
      return res.status(response.status).json({message: 'Bad response from receiver: ' + response.status});
    }
    return res.json(await response.json());
  } catch (e) {
    return res.status(400).json({message: e?.message});
  }
}

module.exports = {
  sendReferral,
};
