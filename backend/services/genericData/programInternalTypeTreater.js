const { getPredefinedProperty, getInternalTypeValues, isPartnerUpdateNeeded } = require("./helperFunctions");
const { getGenericPartners } = require("../partnerOrganization");
const { sendPartnerUpdateNotification } = require("../partnerNetwork/update");

const FORMTYPE = 'program'
const programInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = getPredefinedProperty(FORMTYPE, internalType);
  if (property === 'serviceProvider' || property === 'manager') {
    instanceData[property] = value;
  } else if (property === 'needSatisfiers') {
    instanceData['needSatisfiers'] = value;
  } else if (property === 'partnerOrganizations') {
    instanceData['partnerOrganizations'] = value;
  }
}

const programInternalTypeFetchTreater = async (data) => {
  return getInternalTypeValues(['serviceProvider', 'manager', 'needSatisfiers', 'partnerOrganizations'], data, FORMTYPE)
}

const programInternalTypeUpdateTreater = async (internalType, value, result) => {
  await programInternalTypeCreateTreater(internalType, result, value);
}

const afterCreateProgram = async function (data) {
  if (!(await isPartnerUpdateNeeded(data, 'Program'))) {
    return;
  }

  const partnersAfterUpdate = await getGenericPartners(data, 'Program');
  for (const partnerId of partnersAfterUpdate) {
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

const afterUpdateProgram = async function (data, oldGeneric) {
  if (!(await isPartnerUpdateNeeded(data, 'Program') || await isPartnerUpdateNeeded(oldGeneric, 'Program'))) {
    return;
  }

  const partnersBeforeUpdate = await getGenericPartners(oldGeneric, 'Program');
  const partnersAfterUpdate = await getGenericPartners(data, 'Program');
  const allPartners = [...new Set([...partnersBeforeUpdate, ...partnersAfterUpdate])];
  for (const partnerId of allPartners) {
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

const afterDeleteProgram = async function (oldGeneric) {
  if (!(await isPartnerUpdateNeeded(oldGeneric, 'Program'))) {
    return;
  }

  const partnersBeforeUpdate = await getGenericPartners(oldGeneric, 'Program');
  for (const partnerId of partnersBeforeUpdate) {
    sendPartnerUpdateNotification(partnerId); // no await
  }
}

module.exports = {
  programInternalTypeCreateTreater, programInternalTypeFetchTreater, programInternalTypeUpdateTreater,
  afterCreateProgram, afterUpdateProgram, afterDeleteProgram
}
