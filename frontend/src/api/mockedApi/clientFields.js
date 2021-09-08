import { BrowserStore } from './browserStore';
import { sleep } from "../index";

const defaultClientFields = {
  "steps_order": [
    "info"
  ],
  "form_structure": {
    "info": {
      "first_name": false,
      "last_name": false,
      "gender": false,
      "first_language": false,
      "birth_date": false,
      "ngo_conditions": false,
      "status_in_canada": false,
      "country_of_origin": false,
      "has_children": false
    }
  }
};

const clientFieldsStore = new BrowserStore('client-fields', defaultClientFields);
export async function fetchClientFields() {
  await sleep(200);
  // ugly deep copy
  return JSON.parse(JSON.stringify(clientFieldsStore.value));
}

export async function updateClientFields(updatedClientFields) {
  await sleep(200);
  clientFieldsStore.value = updatedClientFields;
}
