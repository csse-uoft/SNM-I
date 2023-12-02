const {
  GDBOrganizationModel, GDBServiceProviderModel
} = require("../../models");
const {GDBProgramModel} = require("../../models/program/program");
const {GDBServiceModel} = require("../../models/service/service");
const {createSingleGenericHelper, fetchSingleGenericHelper, updateSingleGenericHelper,
  deleteSingleGenericHelper, fetchGenericDatasHelper} = require("../genericData");
const {findCharacteristicById, initPredefinedCharacteristics, PredefinedCharacteristics, PredefinedInternalTypes} = require("../characteristics");
const {getProviderById} = require("../genericData/serviceProvider");
const {getDynamicFormsByFormTypeHelper} = require("../dynamicForm");

async function populateReferral(referralGeneric) {
  const referral = {};

  const programId = parseInt(referralGeneric[PredefinedInternalTypes['programForReferral']._uri.split('#')[1]]?.split('_')[1]);
  if (!!programId) {
    // TODO: ensure only sending programs that belong to the receiver
    // TODO: correct keys of program obj
    const programGeneric = await fetchSingleGenericHelper('program', programId);
    referral.program = programGeneric;
  }

  const serviceId = parseInt(referralGeneric[PredefinedInternalTypes['serviceForReferral']._uri.split('#')[1]]?.split('_')[1]);
  if (!!serviceId) {
    // TODO: see program TODOs
    referral.service = await fetchSingleGenericHelper('service', serviceId);
  }

  // Client: TODO

  return referral;
}

async function sendReferral(req, res, next) {
  try {
    const {id} = req.params;

    let referralGeneric;
    try {
      referralGeneric = await fetchSingleGenericHelper('referral', id);
    } catch (e) {
      return res.status(404).json({message: 'Referral not found' + e.message ? ': ' + e.message : null});
    }
    const referral = await populateReferral(referralGeneric);

    const receiverId = parseInt(referralGeneric[PredefinedInternalTypes['receivingServiceProviderForReferral']._uri.split('#')[1]]?.split('_')[1]);
    if (!receiverId || isNaN(receiverId)) {
      return res.status(404).json({message: 'Receiving service provider for referral not found' + e.message ? ': ' + e.message : null});
    }

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
      return res.status(404).json({message: 'Receiving organization not found' + e.message ? ': ' + e.message : null});
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
