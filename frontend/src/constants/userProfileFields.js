import {Validator} from "../helpers";
import {defaultField} from "./index";
import {defaultUserFields} from "./default_fields";

export const userProfileFields = {
  givenName: {
    ...defaultField,
    label: 'Given name',
  },
  familyName: {
    ...defaultField,
    label: 'Family name',
  },
  telephone: {
    ...defaultField,
    label: 'Telephone',
    validator: Validator.phone,
    type: 'phoneNumber'
  },
  email: {
    ...defaultField,
    required: true,
    label: 'Primary Email',
    type: 'email',
    validator: Validator.email,
  },
  altEmail: {
    ...defaultField,
    label: 'Secondary Email',
    type: 'email',
    validator: Validator.email,
  }
};
