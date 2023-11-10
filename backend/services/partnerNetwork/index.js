const {
  GDBOrganizationModel
} = require("../../models");
const {fetchSingleGenericHelper} = require("../genericData");
const {findCharacteristicById} = require("../characteristics");

async function refreshOrganization(req, res, next) {
  try {
    const {id} = req.params;

    let organizationGeneric;
    try {
      organizationGeneric = await fetchSingleGenericHelper('organization', id);
    } catch (e) {
      return res.status(404).json({message: 'Partner organization not found'});
    }

    const organization = {};
    for (let [key, data] of Object.entries(organizationGeneric)) {
      const [type, key_id] = key.split('_');
      if (type != 'characteristic') continue;
      const characteristic = await findCharacteristicById(key_id);

      if (typeof data === 'boolean') {
        if (characteristic.name === 'Partner Organization?')
          organization.partner = data;
      } else if (typeof data === 'string') {
        if (characteristic.name === 'Endpoint URL') {
          organization.endpointUrl = data;
        } else if (characteristic.name === 'API Key') {
          organization.apiKey = data;
        }
      } else if (typeof data === 'number') {
        if (characteristic.name === 'Endpoint Port Number') {
          organization.endpointPort = data;
        }
      }
    }

    if (organization.partner) {
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

module.exports = {
  refreshOrganization
};
