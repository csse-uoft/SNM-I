const {
  GDBOrganizationModel
} = require("../../models");
const {fetchSingleGenericHelper} = require("../genericData");
const {findCharacteristicById} = require("../characteristics");

async function refreshOrganization(req, res, next) {
  try {
    const {id} = req.params;

    const organizationGeneric = await fetchSingleGenericHelper('organization', id);

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
        return res.status(200).json({data: {'success': true}, success: true});
      } else {
        return res.status(400).json({message: 'The partner organization does not have a valid URL, port, and/or API key'});
      }
    } else {
      return res.status(400).json({message: 'The entity to refresh is not a partner organization'});
    }
  } catch (e) {
    next(e);
  }
}

module.exports = {
  refreshOrganization
};
