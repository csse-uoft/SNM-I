const { sendPartnerUpdateNotification } = require("../partnerNetwork/update");
const { getGenericPartners } = require("../partnerOrganization");
const { getPredefinedProperty, getInternalTypeValues, isPartnerUpdateNeeded } = require("./helperFunctions");

const FORMTYPE = 'volunteer'
const volunteerInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'partnerOrganizations' || property === 'organization') {
    instanceData[property] = value;
  }
}

const volunteerInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['partnerOrganizations', 'organization'], data, FORMTYPE)
}

const volunteerInternalTypeUpdateTreater = async (internalType, value, result) => {
  await volunteerInternalTypeCreateTreater(internalType, result, value);
}

const afterCreateVolunteer = async function (data, req) {
  if (!(await isPartnerUpdateNeeded(data, 'Volunteer'))) {
    return;
  }

  const partnersAfterUpdate = await getGenericPartners(data, 'Volunteer');
  for (const partnerId of partnersAfterUpdate) {
    await sendPartnerUpdateNotification(req, partnerId);
  }
}

const afterUpdateVolunteer = async function (data, oldGeneric, req) {
  if (!(await isPartnerUpdateNeeded(data, 'Volunteer') || await isPartnerUpdateNeeded(oldGeneric, 'Volunteer'))) {
    return;
  }

  const partnersBeforeUpdate = await getGenericPartners(oldGeneric, 'Volunteer');
  const partnersAfterUpdate = await getGenericPartners(data, 'Volunteer');
  const allPartners = [...new Set([...partnersBeforeUpdate, ...partnersAfterUpdate])];
  for (const partnerId of allPartners) {
    await sendPartnerUpdateNotification(req, partnerId);
  }
}

const afterDeleteVolunteer = async function (oldGeneric, req) {
  if (!(await isPartnerUpdateNeeded(oldGeneric, 'Volunteer'))) {
    return;
  }

  const partnersBeforeUpdate = await getGenericPartners(oldGeneric, 'Volunteer');
  for (const partnerId of partnersBeforeUpdate) {
    await sendPartnerUpdateNotification(req, partnerId);
  }
}

module.exports = {
  volunteerInternalTypeCreateTreater, volunteerInternalTypeFetchTreater, volunteerInternalTypeUpdateTreater,
  afterCreateVolunteer, afterUpdateVolunteer, afterDeleteVolunteer
}
