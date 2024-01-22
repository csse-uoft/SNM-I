const { sendPartnerUpdateNotification } = require("../partnerNetwork/update");
const { getGenericPartners } = require("../partnerOrganization");
const { getPredefinedProperty, getInternalTypeValues, isPartnerUpdateNeeded } = require("./helperFunctions");

const FORMTYPE = 'service'
const serviceInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'serviceProvider' || property === 'program') {
    instanceData[property] = value;
  } else if (property === 'needSatisfiers') {
    instanceData['needSatisfiers'] = value;
  } else if (property === 'partnerOrganizations') {
    instanceData['partnerOrganizations'] = value;
  }
}

const serviceInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['serviceProvider', 'program', 'needSatisfiers', 'partnerOrganizations'], data, FORMTYPE)
}

const serviceInternalTypeUpdateTreater = async (internalType, value, result) => {
  await serviceInternalTypeCreateTreater(internalType, result, value);
}


const afterCreateService = async function (data) {
  if (!(await isPartnerUpdateNeeded(data, 'Service'))) {
    return;
  }

  const partnersAfterUpdate = await getGenericPartners(data, 'Service');
  for (const partnerId of partnersAfterUpdate) {
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

const afterUpdateService = async function (data, oldGeneric) {
  if (!(await isPartnerUpdateNeeded(data, 'Service') || await isPartnerUpdateNeeded(oldGeneric, 'Service'))) {
    return;
  }

  const partnersBeforeUpdate = await getGenericPartners(oldGeneric, 'Service');
  const partnersAfterUpdate = await getGenericPartners(data, 'Service');
  const allPartners = [...new Set([...partnersBeforeUpdate, ...partnersAfterUpdate])];
  for (const partnerId of allPartners) {
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

const afterDeleteService = async function (oldGeneric) {
  if (!(await isPartnerUpdateNeeded(oldGeneric, 'Service'))) {
    return;
  }

  const partnersBeforeUpdate = await getGenericPartners(oldGeneric, 'Service');
  for (const partnerId of partnersBeforeUpdate) {
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

module.exports = {
  serviceInternalTypeCreateTreater, serviceInternalTypeFetchTreater, serviceInternalTypeUpdateTreater,
  afterCreateService, afterUpdateService, afterDeleteService
}
