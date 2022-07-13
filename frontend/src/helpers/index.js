import {titleCase} from './formulaHelpers';
export {titleCase}
/**
 * Flip object key value pairs
 * @param obj
 * @returns {{}}
 */
export const objectFlip = (obj) => {
  const ret = {};
  Object.keys(obj).forEach(key => {
    ret[obj[key]] = key;
  });
  return ret;
};

/**
 * Recursively assign obj to target.
 * Similar to Object.assign(obj1, obj2), or {...obj1, ...obj2} but also assign nested objects.
 * @param target
 * @param obj
 * @returns {*}
 */
export const recursiveAssign = (target, obj) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value != null && target[key])
      return recursiveAssign(target[key], value);
    else if (value != null)
      target[key] = value;
  });
  return target;
};

/**
 * return true if the field is empty
 * @param field
 * @returns {boolean}
 */

export function isFieldEmpty(field) {
  if (field == null) {
    return true;
  } else {
    return field.length === 0;
  }
}

/**
 * return true if the field availability is empty
 * @param availability
 * @returns {boolean}
 */

export function isAvailabilityEmpty(availability) {
  if (availability == null) {
    return true;
  } else {
    for (const day of Object.keys(availability)) {
      for (const time_slot of availability[day]) {
        if (time_slot['start_time'].length > 0 && time_slot['end_time'].length > 0) {
          //time slot is filled in
          return false;
        }
      }
    }
    return true;
  }
}

/**
 * Verify the address fields and set the given result.
 * @param location {{apt_number, }}
 * @param result
 */
export function verifyAddressField(location, result) {
  for (const [fieldName, value] of Object.entries(location)) {
    // apartment number is not required
    if (fieldName === 'apt_number')
      continue;
    if (isFieldEmpty(value))
      result[fieldName] = 'This field is required'
  }
}

/**
 * Verify the other address fields and set the corresponding errors if there are any.
 * @param location []
 * @param result
 */
export function verifyOtherAddressesFields(location, result) {
  let i = 0;
  for (const address of location) {
    result[i] = {};
    verifyAddressField(address, result[i]);
    if (Object.entries(result[i]).length === 0) {
      delete result[i];
    }
    i++;
  }
}

/**
 * Validate postal code in parentField, put error message in errsContainer if there is one.
 * @param field
 * @param errsContainer
 * @param parentField
 */
export function validateAddressPostalCode(field, errsContainer, parentField) {
  if (field) {
    const postal_code_regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    const is_postal_code_valid = postal_code_regex.test(field);
    if (!is_postal_code_valid) {
      errsContainer[parentField] = {
        ...errsContainer[parentField],
        'postal_code': "Invalid postal code! They are in the format A1A 1A1, " +
          "where A is a letter and 1 is a digit"
      };
    }
  }
}

export function verifyEmail(field, fieldName, errsContainer){
  const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email_regex.test(field)) {
    errsContainer[fieldName] = "Invalid email! ".concat("They are in the format of jsmith@example.com");
  }
}

export function verifyPhoneNumber(field, fieldName, errsContainer){
  const phone_number_regex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  if (field && !phone_number_regex.test(field)){
    errsContainer[fieldName] = "Invalid phone number! They are in the format of NPA-NXX-XXXX ".concat(
      "where NPA is the three digit area code and NXX-XXXX is the seven digit subscriber number"
    )
  }
}
export function validateContactFormat(profile, errsContainer) {
  // Verify email
  if (profile.email) {
    verifyEmail(profile.email,'email', errsContainer)
  }
  // Verify Phone number
  if (profile.primary_phone_number || profile.alt_phone_number) {
    verifyPhoneNumber(profile.primary_phone_number, 'primary_phone_number', errsContainer);
    verifyPhoneNumber(profile.alt_phone_number, 'alt_phone_number', errsContainer);
  }
}

/**
 * Verify the family fields and set the corresponding errors if there are any.
 * @param families []
 * @param result
 */
export function verifyFamilyFields(families, result) {
  let i = 0;
  for (const family of families) {
    result[i] = {};
    if (isFieldEmpty(family['relationship'])) {
      result[i]['relationship'] = "This field is required";
    }
    for (const [field, value] of Object.entries(family['person'])) {
      if (isFieldEmpty(value)) {
        result[i][field] = "This field is required";
      }
    }
    if (Object.entries(result[i]).length === 0) {
      delete result[i];
    }
    i++;
  }
}

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const phoneNumberRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const passwordRegex = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const phoneNumberRegex = /^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/
const inNorthAmericaRegex = /^\+1/
const emptyPhoneNumber = /^\+1$/
const emptyTelephone = /^\+$/
const samePassword = /admin/
const sameEmail = /admin@sample.com/

const EMAIL_ERR_MSG = "Invalid email format! Email must be in the format of e.g. jsmith@example.com.";
const PHONE_ERR_MSH = "Invalid phone number!" //+ "They are in the format of NPA-NXX-XXXX " +
// // "where NPA is the three digit area code and NXX-XXXX is the seven digit subscriber number";
const PASSWORD_ERR_MSG = "Your password doesn't satisfy the minimum requirements.";
const OLD_PASSWORD_ERR_MSG = "Your input doesn't match the old password!  Please try again.";
const CONFIRM_EMAIL_ERR_MSG = "Your input doesn't match your registered email!  Please try again.";
const POSTAL_CODE_ERR_MSG = "Invalid postal code format! Postal code must be in the format of e.g. A1A 1A1" +
  "where A is a letter and 1 is a digit.";
const EXPIRATION_DATE_MSG = "This date is in the past.  Please enter a valid date."
const CONFIRM_PASSWORD_ERR_MSG = 'Your passwords do not match!  Please try again.'

export const Validator = {
  /**
   * @param email
   * @returns {string|void} Return string iff fails. Otherwise return undefined.
   */
  email: email => {
    if (!emailRegex.test(email)) {
      return EMAIL_ERR_MSG;
    }
  },

  confirmEmail: email => {
    if (!emailRegex.test(email)) {
      return EMAIL_ERR_MSG;
    }
    if (!sameEmail.test(email)) {
      return CONFIRM_EMAIL_ERR_MSG;
    }
  },

  phone: phone => {
    if (!emptyPhoneNumber.test(phone) && inNorthAmericaRegex.test(phone) && !phoneNumberRegex.test(phone))
      return PHONE_ERR_MSH;
    if (emptyPhoneNumber.test(phone)) {
      return PHONE_ERR_MSH;
    }
    if (emptyTelephone.test(phone)) {
      return PHONE_ERR_MSH;
    }
  },

  oldPassword: oldPassword => {
    if (!samePassword.test(oldPassword))
      return OLD_PASSWORD_ERR_MSG;
  },

  password: password => {
    if (!passwordRegex.test(password))
      return PASSWORD_ERR_MSG;
  },

  confirmPassword: (confirmPassword, password) => {
    if (confirmPassword !== password)
      return CONFIRM_PASSWORD_ERR_MSG
  },

  postalCode: postalCode => {
    if (!postalCodeRegex.test(postalCode))
      return POSTAL_CODE_ERR_MSG;
  },

  expirationDate: expirationDate => {
    if(new Date(expirationDate) < new Date())
      return EXPIRATION_DATE_MSG
  }
};
