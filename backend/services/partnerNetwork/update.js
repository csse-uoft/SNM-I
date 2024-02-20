const {formatLocation} = require("../../helpers/location");
const {sanitize} = require("../../helpers/sanitizer");
const {GDBServiceProviderModel, GDBAddressModel} = require("../../models");
const {GDBOrganizationModel} = require("../../models/organization");
const {getIndividualsInClass} = require("../dynamicForm");
const {createNotificationHelper} = require("../notification/notification");

async function sendPartnerUpdateNotification(req, partnerId) {
  const { fetchSingleGenericHelper } = require("../genericData");
  const { getOrganization } = require(".");

  try {
    const organization = await getOrganization(await fetchSingleGenericHelper('organization', partnerId));
    if (organization.status === 'Partner') {
      if (organization.endpointUrl && organization.endpointPort && organization.apiKey) {
        const endpointUrl = organization.endpointUrl;
        const url = new URL('/public/partnerNetwork/update/', endpointUrl.startsWith('http') ? endpointUrl
          : 'https://' + endpointUrl);
        url.port = organization.endpointPort;

        const homeOrganization = await GDBOrganizationModel.findOne({ status: 'Home' }, { populates: [] });
        let senderApiKey = null;
        if (!!homeOrganization) {
          senderApiKey = homeOrganization.apiKey;
        } else {
          return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(url, {
          signal: controller.signal,
          method: 'POST',
          headers: {
            'X-RECEIVER-API-KEY': organization.apiKey,
            ...(!!senderApiKey && { 'X-SENDER-API-KEY': senderApiKey }),
            'Referer': req.headers.host,
          },
        });
        clearTimeout(timeout);

        if (response.status >= 400 && response.status < 600) {
          const json = await response.json();
          throw new Error('Bad response from partner: ' + response.status + ': '
            + (json.message || JSON.stringify(json)));
        }
      } else {
        throw new Error('The partner organization does not have a valid URL, port, and/or API key');
      }
    } else {
      throw new Error('The entity to refresh is not a partner organization');
    }
  } catch (e) {
    console.log(e);
  }
}

async function printAddress(address) {
  const streetTypes = await getIndividualsInClass('ic:StreetType');
  const streetDirections = await getIndividualsInClass('ic:StreetDirection');
  const states = await getIndividualsInClass('schema:State');
  const addressInfo = {streetTypes, streetDirections, states};

  if (typeof address === 'string') {
    address = await GDBAddressModel.findOne({_id: address.split('_')[1]});
  }

  return sanitize(formatLocation(address, addressInfo));
}

async function receivePartnerUpdateNotification(req, res, next) {
  const { fetchOrganizationHelper, deleteOrganizationHelper, updateOrganizationHelper } = require(".");

  try {
    const homeOrganization = await GDBOrganizationModel.findOne({ status: 'Home' },
      { populates: ['characteristicOccurrences.occurrenceOf'] });
    if (!homeOrganization) {
      throw new Error('This deployment has no home organization');
    }

    const receiverApiKey = req.header('X-RECEIVER-API-KEY');
    const senderApiKey = req.header('X-SENDER-API-KEY');
    if (receiverApiKey !== homeOrganization.apiKey) {
      return res.status(403).json({ message: 'API key is incorrect' });
    }

    const partnerOrganization = await GDBOrganizationModel.findOne({ apiKey: senderApiKey,
      endpointUrl: req.headers.referer });
    if (partnerOrganization && partnerOrganization.apiKey === senderApiKey
        && partnerOrganization.endpointUrl === req.headers.referer) {
      const partnerData = await fetchOrganizationHelper(req, partnerOrganization._id);

      const partnerServiceProvider = await GDBServiceProviderModel
        .findOne({organization: {_id: partnerOrganization._id}});
      if (!partnerData.organization || Object.keys(partnerData.organization).length === 0) {
        const {partnerJson} = await deleteOrganizationHelper(partnerServiceProvider._id, partnerData);
        // Notify the user of the deleted partner organization
        createNotificationHelper({
          name: 'A partner deployment deleted its home organization',
          description: `<div><p>${sanitize(partnerJson.name)}, one of your partners, just deleted its home organization.</p>`
            + `<p>To reconnect with them, ask them to set up a home organization again and then create a partner `
            + `organization for that partner.</p>`
            + `<p>For reference, here are the details of the partner:</p>`
            + `<dl>`
            + (partnerJson.description?.length > 0 ? `<dt>Description:</dt><dd>${sanitize(partnerJson.description)}</dd>` : '')
            + (partnerJson.address ? `<dt>Address:</dt><dd>${await printAddress(partnerJson.address)}</dd>` : '')
            + `<dt>Endpoint URL:</dt><dd>${partnerJson.endpointUrl}</dd>`
            + `<dt>Endpoint Port:</dt><dd>${partnerJson.endpointPort}</dd>`
            + `</dl></div>`
        });
        return res.status(200).json({success: true});
      } else {
        const {partnerJson} = await updateOrganizationHelper(partnerServiceProvider._id, partnerData);
        // Notify the user of the updated partner organization
        createNotificationHelper({
          name: 'A partner deployment updated its home organization',
          description: `<a href="/providers/organization/${partnerJson._id}">${sanitize(partnerJson.name)}</a>, one of your `
            + `partners, just updated its home organization.`
        });
        return res.status(200).json({success: true});
      }
    } else {
      return res.status(404).json({ message: 'Your API key does not match any partner\'s API key' });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e?.message });
  }
}

module.exports = {
  sendPartnerUpdateNotification,
  receivePartnerUpdateNotification
};