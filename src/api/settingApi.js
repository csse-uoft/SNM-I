import { getJson, postJson } from "./index";


export function fetchClientFields() {
  return getJson('/settings/get_client_fields/');
}

export function updateClientFields(params) {
  return postJson('/settings/update_client_fields/', params);
}

export async function fetchProviderFields(reformat = true) {
  const data = await getJson('/settings/get_provider_fields/');
  if (reformat) {
    // transform to the same object as client fields
    Object.keys(data).forEach(providerType => {
      const formStructure = data[providerType].form_structure;
      Object.keys(formStructure).forEach(stepName => {
        const fields = formStructure[stepName];
        formStructure && Object.keys(fields).forEach(fieldName => {
          // skip questions
          if (fields[fieldName].type !== 'field') return;
          fields[fieldName] = fields[fieldName].required;
        })
      })
    });
  }
  return data;
}

export function updateProviderFields(params) {
  return postJson('/settings/update_provider_fields/', params);
}