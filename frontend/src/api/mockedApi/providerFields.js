import { BrowserStore } from './browserStore';
import { sleep } from "../index";

const defaultProviderFields =
  {
    "organization": {
      "steps_order": ["s1"],
      "form_structure": {
        "s1": {
          "company": {"type": "field", "required": false},
          "status": {"type": "field", "required": false}
        }
      }
    },
    "volunteer": {
      "steps_order": ["s1"],
      "form_structure": {
        "s1": {
          "first_name": {"type": "field", "required": false},
          "last_name": {"type": "field", "required": false}
        }
      }
    },
    "goods_donor": {"steps_order": [], "form_structure": {}},
    "professional_service_provider": {"steps_order": [], "form_structure": {}}
  };

const providerFieldsStore = new BrowserStore('provider-fields', defaultProviderFields);

export async function fetchProviderFields(reformat = true) {
  await sleep(200);
  // ugly deep copy
  const data = JSON.parse(JSON.stringify(providerFieldsStore.value));
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
          console.log(fieldName)
        })
      })
    });
    console.log('fetchProviderFields', data)
    return data;
  }
  return data;
}

export async function updateProviderFields(updatedProviderFields) {
  await sleep(200);
  providerFieldsStore.value = updatedProviderFields
}
