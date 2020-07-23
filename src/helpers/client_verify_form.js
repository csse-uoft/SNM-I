import {
  recursiveAssign,
  isFieldEmpty,
  verifyAddressField,
  validateAddressPostalCode,
  validateContactFormat,
  verifyFamilyFields,
} from "./index";

// Verify the params filled in client form
export function client_verify_form(form, steps) {
  const format_messages = verifyFormFormat(form);
  const required_field_msg = verifyRequiredField(form, steps);
  return recursiveAssign(required_field_msg, format_messages);
}

/**
 * verify if every required field is filled in
 * @returns a result obj {} with error messages added in corresponding key
 */
function verifyRequiredField(form, steps) {
  let result = {};
  for (const step_page_fields of steps) {
    // traverse each step page in steps
    for (const [field, required] of Object.entries(step_page_fields)) {
      if (required) {
        if (field in form && isFieldEmpty(form[field])) {
          //  key in form
          result[field] = 'This field is required';
        } else if (field in form.profile && isFieldEmpty(form.profile[field])) {
          result[field] = 'This field is required';
        } else if (field === 'family' && field in form) {
          if (form[field].length === 0){
            result['family'] = "Please add at least one family member!";
          } else{
            // Some fields in family are not filled in
            result[field] = {}
            verifyFamilyFields(form[field]['members'], result[field])
            if (Object.entries(result[field]).length === 0) {
              delete result[field];
            }
          }

        } else if (field === 'address') {
          result[field] = {};
          verifyAddressField(form[field], result[field]);
          if(Object.entries(result[field]).length === 0){
            delete result[field];
          }
        }
      }
    }
  }
  return result
}

/**
 * verify format for various field
 * @param form
 * @returns a result obj {} with error messages added in corresponding key
 */
function verifyFormFormat(form) {
  let result = {}
  // Verify postal code
  validateAddressPostalCode(form.address.postal_code, result, 'address')

  // verify profile
  if(form.profile){
    validateContactFormat(form.profile, result)
  }
  return result;
}
