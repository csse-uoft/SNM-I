import RadioField from "../components/shared/fields/RadioField";
import { Validator } from "../helpers";
import { defaultField } from "./index";

export const userInvitationFields = {
  is_superuser: {
    ...defaultField,
    label: 'Admin?',
    component: RadioField,
    options: {Yes: true, No: false},
    required: true,
  },
  email: {
    ...defaultField,
    required: true,
    label: 'Email',
    type: 'email',
    validator: Validator.email,
  },
  expirationDate: {
    ...defaultField,
    required: true,
    label: 'Expiration date',
    type: 'date',
    validator: Validator.expirationDate
  }
};