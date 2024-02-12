const { PredefinedCharacteristics } = require("../characteristics");
const { sendPartnerUpdateNotification } = require("../partnerNetwork/update");
const { getPartnerOrganizationsHelper } = require("../partnerOrganization");

const afterUpdateOrganization = async function (data, oldGeneric) {
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
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

const afterDeleteOrganization = async function (oldGeneric) {
  await afterUpdateOrganization({}, oldGeneric);
}

module.exports = {
  afterUpdateOrganization, afterDeleteOrganization
}
