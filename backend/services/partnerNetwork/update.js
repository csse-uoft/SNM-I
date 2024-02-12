const { GDBServiceProviderModel } = require("../../models");
const { GDBOrganizationModel } = require("../../models/organization");

async function sendPartnerUpdateNotification(partnerId) {
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
      const partnerData = await fetchOrganizationHelper(partnerOrganization._id);

      const partnerServiceProvider = await GDBServiceProviderModel
        .findOne({organization: {_id: partnerOrganization._id}});
      if (!partnerData.organization || Object.keys(partnerData.organization).length === 0) {
        await deleteOrganizationHelper(partnerServiceProvider._id, partnerData);
        return res.status(204).send();
      } else {
        await updateOrganizationHelper(partnerServiceProvider._id, partnerData);
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