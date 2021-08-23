import { recursiveAssign, isFieldEmpty, isAvailabilityEmpty, verifyAddressField,
  verifyOtherAddressesFields, validateAddressPostalCode, validateContactFormat,
  verifyEmail, verifyPhoneNumber} from "./index";


// Verify the params filled in client form
export function provider_verify_form(form, steps) {
  const format_messages = verifyFormFormat(form);
  // const format_messages = {}
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
        if (field === 'availability' && isAvailabilityEmpty(form['operation_hours'])) {
          result['availability'] = "Please fill in at least one availability time slot!";
        } else if (field === 'main_address') {
          result[field] = {};
          verifyAddressField(form[field], result[field]);
          if (Object.entries(result[field]).length === 0) {
            delete result[field];
          }
        } else if (field === 'other_addresses') {
          if (form[field].length === 0) {
            // The user did not create an other address
            result[field] = "Please create at least one other address form!"
          } else {
            // Some fields in other address are not filled in
            result[field] = {};
            verifyOtherAddressesFields(form[field], result[field])
            if (Object.entries(result[field]).length === 0) {
              delete result[field];
            }
          }
        } else if (field === "primary_contact"){
          verifyContactEmptiness(field, form, result, 'primary_contact')
        } else if (field === 'secondary_contact'){
          verifyContactEmptiness(field, form, result, 'secondary_contact')
        } else {
          verifyRequiredFieldByFormType(field, form, result)
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
  validateAddressPostalCode(form.main_address.postal_code, result, 'main_address')
  if (form.other_addresses.length > 0){
    result['other_addresses'] = {};
    let i = 0;
    for (const address of form.other_addresses){
      validateAddressPostalCode(address.postal_code, result['other_addresses'], i);
      i++;
    }
    if (Object.entries(result['other_addresses']).length === 0) {
      delete result['other_addresses'];
    }
  }

  if(form.primary_contact.profile){
    if (!!!result['primary_contact']){
      // if field secondary_contact doesn't exist, create one first
      result['primary_contact'] = {};
    }
    validateContactFormat(form.primary_contact.profile, result['primary_contact'])
    if (Object.entries(result['primary_contact']).length === 0) {
      delete result['primary_contact'];
    }
  }

  if(form.secondary_contact.profile){
    if (!!!result['secondary_contact']){
      // if field secondary_contact doesn't exist, create one first
      result['secondary_contact'] = {};
    }
    validateContactFormat(form.secondary_contact.profile, result['secondary_contact'])
    if (Object.entries(result['secondary_contact']).length === 0) {
      delete result['secondary_contact'];
    }
  }

  if(form.reference1_email.length !== 0){
    verifyEmail(form.reference1_email, 'reference1_email', result);
  }
  if(form.reference2_email.length !== 0){
    verifyEmail(form.reference2_email, 'reference2_email', result);
  }
  if(form.reference1_phone.length !== 0){
    verifyPhoneNumber(form.reference1_phone, 'reference1_phone', result);
  }
  if(form.reference2_phone.length !== 0){
    verifyPhoneNumber(form.reference2_phone, 'reference2_phone', result);
  }

  if(form.type === "Individual"){
    //check fields in form.profile
    if(form.profile.email.length !== 0){
      verifyEmail(form.profile.email, 'email', result);
    }
    if(form.profile.primary_phone_number.length !== 0){
      verifyPhoneNumber(form.profile.primary_phone_number, 'primary_phone_number', result);
    }
    if(form.profile.alt_phone_number.length !== 0){
      verifyPhoneNumber(form.profile.alt_phone_number, 'alt_phone_number', result);
    }
  }
  return result;
}

/**
 * Check the field in contact emptiness and generate error message for the corresponding field
 * @param field
 * @param form
 * @param result
 * @param contactType Can be either "primary_contact" or "secondary_contact"
 */
function verifyContactEmptiness(field, form, result, contactType){
  for (const field of Object.keys(form[contactType]['profile'])){
    if(isFieldEmpty(form[contactType]['profile'][field])){
      if (!!!result[contactType]){
        // if field contactType doesn't exist, create one first
        result[contactType] = {};
      }
      result[contactType][field] = "This field is required"
    }
  }
}

/**
 * Verify required fields that are depends on form type, form type can either be "Individual" or "Organization".
 * @param field
 * @param form
 * @param result
 */
function verifyRequiredFieldByFormType(field, form, result){
  const org_ignore_fields = ["email", "primary_phone_number", "alt_phone_number", "profile"]
  const individual_ignore_fields = ["email", "primary_phone_number", "alt_phone_number"]
  if (form.type === "Individual"){
    if (field in form['profile'] && isFieldEmpty(form['profile'][field])){
      result[field] = 'This field is required';
    } else if (field in form && !individual_ignore_fields.includes(field) && isFieldEmpty(form[field])) {
      result[field] = 'This field is required';
    }
  } else if (form.type === 'Organization'){
    if (field in form && !org_ignore_fields.includes(field) && isFieldEmpty(form[field])) {
      result[field] = 'This field is required';
    }
  }
}