import RadioField from "../components/shared/fields/RadioField";
import { Validator } from "../helpers";
import { defaultField } from "./index";

export const userFormFields = {
  is_superuser: {
    ...defaultField,
    label: 'Admin?',
    component: RadioField,
    options: {Yes: true, No: false},
    required: true,
  },
  username: {
    ...defaultField,
    label: 'Username',
    required: true,
  },
  password: {
    ...defaultField,
    label: 'Password',
    type: 'password',
    required: true,
    validator: Validator.password
  },
  first_name: {
    ...defaultField,
    label: 'First name',
  },
  last_name: {
    ...defaultField,
    label: 'Last name',
  },
  email: {
    ...defaultField,
    label: 'Email',
    type: 'email',
    validator: Validator.email,
  },
  primary_phone_number: {
    ...defaultField,
    label: 'Telephone',
    validator: Validator.phone
  },
  alt_phone_number: {
    ...defaultField,
    label: 'Alternate phone number',
    validator: Validator.phone
  }
};