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

const afterCreateVolunteer = async function (data) {
  if (!(await isPartnerUpdateNeeded(data, 'Volunteer'))) {
    return;
  }

  const partnersAfterUpdate = await getGenericPartners(data, 'Volunteer');
  for (const partnerId of partnersAfterUpdate) {
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

const afterUpdateVolunteer = async function (data, oldGeneric) {
  if (!(await isPartnerUpdateNeeded(data, 'Volunteer') || await isPartnerUpdateNeeded(oldGeneric, 'Volunteer'))) {
    return;
  }

  const partnersBeforeUpdate = await getGenericPartners(oldGeneric, 'Volunteer');
  const partnersAfterUpdate = await getGenericPartners(data, 'Volunteer');
  const allPartners = [...new Set([...partnersBeforeUpdate, ...partnersAfterUpdate])];
  for (const partnerId of allPartners) {
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

const afterDeleteVolunteer = async function (oldGeneric) {
  if (!(await isPartnerUpdateNeeded(oldGeneric, 'Volunteer'))) {
    return;
  }

  const partnersBeforeUpdate = await getGenericPartners(oldGeneric, 'Volunteer');
  for (const partnerId of partnersBeforeUpdate) {
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

module.exports = {
  volunteerInternalTypeCreateTreater, volunteerInternalTypeFetchTreater, volunteerInternalTypeUpdateTreater,
  afterCreateVolunteer, afterUpdateVolunteer, afterDeleteVolunteer
}
