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

const rawClientFieldFromStorage = localStorage.getItem('client-fields');
let clientFields = rawClientFieldFromStorage && JSON.parse(rawClientFieldFromStorage) || defaultClientFields;

export async function fetchClientFields() {
  return clientFields;
}

export async function updateClientFields(updatedClientFields) {
  clientFields = updatedClientFields;
  localStorage.setItem('client-fields', JSON.stringify(clientFields));
}