const {
  GDBOrganizationModel
} = require("../../models");
const {fetchSingleGenericHelper, updateSingleGenericHelper, fetchGenericDatasHelper} = require("../genericData");
const {findCharacteristicById, PredefinedCharacteristics} = require("../characteristics");
const {getProviderById} = require("../genericData/serviceProvider");
const {getDynamicFormsByFormTypeHelper} = require("../dynamicForm");

async function fetchOrganization(req, res, next) {
  try {
    const {id} = req.params;

    let organizationGeneric;
    try {
      organizationGeneric = await fetchSingleGenericHelper('organization', id);
    } catch (e) {
      return res.status(404).json({message: 'Partner organization not found'});
    }

    const organization = await getOrganization(organizationGeneric);

    if (organization.status === 'Partner') {
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

async function updateOrganization(req, res, next) {
  try {
    const partnerData = req.body;
    const {id} = req.params;

    const organizationForms = await getDynamicFormsByFormTypeHelper('organization');
    if (organizationForms.length > 0) {
      var organizationFormId = organizationForms[0]._id; // Select the first form
    } else {
      return res.status(400).json({message: 'No organization form available'});
    }

    const programForms = await getDynamicFormsByFormTypeHelper('program');
    if (programForms.length > 0) {
      var programFormId = programForms[0]._id; // Select the first form
    } else {
      return res.status(400).json({message: 'No program form available'});
    }

    const serviceForms = await getDynamicFormsByFormTypeHelper('service');
    if (serviceForms.length > 0) {
      var serviceFormId = serviceForms[0]._id; // Select the first form
    } else {
      return res.status(400).json({message: 'No service form available'});
    }

    const volunteerForms = await getDynamicFormsByFormTypeHelper('volunteer');
    if (volunteerForms.length > 0) {
      var volunteerFormId = volunteerForms[0]._id; // Select the first form
    } else {
      return res.status(400).json({message: 'No volunteer form available'});
    }

    const organization = {fields: {}};
    organization.fields[PredefinedCharacteristics['Organization Name']._uri.split('#')[1]] = partnerData.organization.organizationName;
    organization.fields[PredefinedCharacteristics['Description']._uri.split('#')[1]] = partnerData.organization.description;
    organization.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]] = partnerData.organization.address; // TODO
    organization.formId = organizationFormId;
    console.log(organization)
    await (await updateSingleGenericHelper(id, organization, 'organization')).save();

    for (programData of partnerData.organization.programs) {
      const program = {fields: {}};
      program.fields[PredefinedCharacteristics['Program Name']._uri.split('#')[1]] = programData.programName;
      program.fields[PredefinedCharacteristics['Description']._uri.split('#')[1]] = programData.description;
      program.formId = programFormId;
      console.log(program);
      // TODO await (await updateSingleGenericHelper(id, program, 'program')).save();
    }

    for (serviceData of partnerData.organization.services) {
      const service = {fields: {}};
      service.fields[PredefinedCharacteristics['Service Name']._uri.split('#')[1]] = serviceData.serviceName;
      service.fields[PredefinedCharacteristics['Description']._uri.split('#')[1]] = serviceData.description;
      service.formId = serviceFormId;
      console.log(service);
      // TODO await (await updateSingleGenericHelper(id, service, 'service')).save();
    }

    for (volunteerData of partnerData.organization.volunteers) {
      const volunteer = {fields: {}};
      volunteer.fields[PredefinedCharacteristics['First Name']._uri.split('#')[1]] = volunteerData.firstName;
      volunteer.fields[PredefinedCharacteristics['Last Name']._uri.split('#')[1]] = volunteerData.lastName;
      volunteer.fields[PredefinedCharacteristics['Address']._uri.split('#')[1]] = volunteerData.address;
      volunteer.formId = volunteerFormId;
      console.log(volunteer);
      // TODO await (await updateSingleGenericHelper(id, volunteer, 'volunteer')).save();
    }

    return res.status(200).json({success: true});
  } catch (e) {
    return res.status(400).json({message: e?.message});
  }
}

async function getOrganization(organizationGeneric) {
  const organization = {};
  for (let [key, data] of Object.entries(organizationGeneric)) {
    const [type, key_id] = key.split('_');
    if (type === 'characteristic') {
      const characteristic = await findCharacteristicById(key_id);

      if (typeof data === 'string') {
        if (characteristic.name === 'Organization Status') {
          organization.status = data;
        } else if (characteristic.name === 'Endpoint URL') {
          organization.endpointUrl = data;
        } else if (characteristic.name === 'API Key') {
          organization.apiKey = data;
        } else if (characteristic.name === 'Organization Name') {
          organization.organizationName = data;
        } else if (characteristic.name === 'Description') {
          organization.description = data;
        }
      } else if (typeof data === 'number') {
        if (characteristic.name === 'Endpoint Port Number') {
          organization.endpointPort = data;
        }
      } else if (typeof data === 'object') {
        if (characteristic.name === 'Address') { // TODO
          organization.address = data;
        }
      }
    }
  }
  return organization;
}

async function getOrganizationPrograms(organizationId) {
  let programs = await fetchGenericDatasHelper('program');
  programs = programs.filter(program =>
    ((program.serviceProvider?._id === organizationId) && (program.shareability !== 'Not shareable'))
  );

  const programsList = [];
  for (programGeneric of programs) {
    const program = {id: programGeneric._id, manager: programGeneric.manager, serviceProvider: programGeneric.serviceProvider};
    for (let [key, data] of Object.entries(programGeneric)) {
      if (key === 'characteristicOccurrences') {
        for (object of data) {
          if (object.occurrenceOf?.name === 'Program Name') {
            program.programName = object.dataStringValue;
          } else if (object.occurrenceOf?.name === 'Description') {
            program.description = object.dataStringValue;
          } else if (object.occurrenceOf?.name === 'Shareability') {
            program.shareability = object.dataStringValue;
          } else if (object.occurrenceOf?.name === 'Address') {
            program.address = object.dataStringValue;
          }
        }
      }
    }
    programsList.push(program);
  }
  return programsList;
}

async function getOrganizationServices(organizationId) { // TODO: Also services of shared programs
  let services = await fetchGenericDatasHelper('service');
  services = services.filter(service =>
    ((service.serviceProvider?._id === organizationId) && (service.shareability !== 'Not shareable'))
  );

  const servicesList = [];
  for (serviceGeneric of services) {
    const service = {id: serviceGeneric._id, manager: serviceGeneric.manager, serviceProvider: serviceGeneric.serviceProvider, program: serviceGeneric.program};
    for (let [key, data] of Object.entries(serviceGeneric)) {
      if (key === 'characteristicOccurrences') {
        for (object of data) {
          if (object.occurrenceOf?.name === 'Service Name') {
            service.serviceName = object.dataStringValue;
          } else if (object.occurrenceOf?.name === 'Description') {
            service.description = object.dataStringValue;
          } else if (object.occurrenceOf?.name === 'Shareability') {
            service.shareability = object.dataStringValue;
          } else if (object.occurrenceOf?.name === 'Address') {
            service.address = object.dataStringValue;
          }
        }
      }
    }
    servicesList.push(service);
  }
  return servicesList;
}

async function getOrganizationVolunteers(organizationId) {
  let volunteers = await fetchGenericDatasHelper('volunteer');
  volunteers = volunteers.filter(volunteer =>
    ((volunteer.organization?._id === organizationId) && (volunteer.shareability !== 'Not shareable'))
  );

  const volunteersList = [];
  for (volunteerGeneric of volunteers) {
    const volunteer = {id: volunteerGeneric._id, organization: volunteerGeneric.organization, address: volunteerGeneric.address};
    for (let [key, data] of Object.entries(volunteerGeneric)) {
      if (key === 'characteristicOccurrences') {
        for (object of data) {
          if (object.occurrenceOf?.name === 'First Name') {
            volunteer.firstName = object.dataStringValue;
          } else if (object.occurrenceOf?.name === 'Last Name') {
            volunteer.lastName = object.dataStringValue;
          } else if (object.occurrenceOf?.name === 'Description') {
            volunteer.description = object.dataStringValue;
          } else if (object.occurrenceOf?.name === 'Shareability') {
            volunteer.shareability = object.dataStringValue;
          }
        }
      }
    }
    volunteersList.push(volunteer);
  }
  return volunteersList;
}

async function sendOrganization(req, res, next) {
  try {
    const {id} = req.params;

    let genericId;
    let organizationGeneric;
    try {
      const provider = await getProviderById(id);
      const providerType = provider.type;
      if (providerType !== 'organization') {
        throw new Error('Provider is not an organization');
      }
      genericId = provider[providerType]._id;
      organizationGeneric = await fetchSingleGenericHelper(providerType, genericId);
    } catch (e) {
      return res.status(404).json({message: 'Organization not found' + e.message ? ': ' + e.message : null});
    }

    const apiKey = req.header('X-API-KEY');

    const organization = await getOrganization(organizationGeneric);
    if (apiKey !== organization.apiKey) {
      return res.status(403).json({message: 'API key is incorrect'});
    }

    let programs = await fetchGenericDatasHelper('program');
    programs = programs.filter(program =>
      ((program.serviceProvider?._id === id) && (program.shareability !== 'Not shareable'))
    );

    organization.programs = await getOrganizationPrograms(id);
    organization.services = await getOrganizationServices(id);
    organization.volunteers = await getOrganizationVolunteers(genericId);

    return res.status(200).json({organization, success: true});
  } catch (e) {
    return res.status(400).json({message: e?.message});
  }
}

module.exports = {
  fetchOrganization,
  updateOrganization,
  sendOrganization
};
