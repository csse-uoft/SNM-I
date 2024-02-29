const { PredefinedCharacteristics } = require("../characteristics");
const { sendPartnerUpdateNotification } = require("../partnerNetwork/update");
const { getPartnerOrganizationsHelper } = require("../partnerOrganization");

const afterUpdateOrganization = async function (data, oldGeneric, req) {
  const wasHomeOrganization = oldGeneric.status === 'Home';
  const isHomeOrganization = data.fields?.[PredefinedCharacteristics['Organization Status']?._uri.split('#')[1]] === 'Home';
  if (!wasHomeOrganization && !isHomeOrganization) {
    return;
  }

  const partners = [];
  const partnerOrganizations = await getPartnerOrganizationsHelper();
  for (const partner in partnerOrganizations) {
    partners.push(partner.split('_')[1]);
  }

  for (const partnerId of partners) {
    await sendPartnerUpdateNotification(req, partnerId);
  }
}

const afterDeleteOrganization = async function (oldGeneric, req) {
  await afterUpdateOrganization({}, oldGeneric, req);
}

module.exports = {
  afterUpdateOrganization, afterDeleteOrganization
}
