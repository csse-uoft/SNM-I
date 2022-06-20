import GeneralField from "../components/shared/fields/GeneralField";

export const UN_SET = 'UN_SET';
export const REQUIRED_HELPER_TEXT = 'This field is required';
export const DUPLICATE_HELPER_TEXT =
    'Your secondary email must be different from the primary email.';
export const PASSWORD_NOT_MATCH_TEXT =
    'Your repeat password does not match, please try again.';

export const defaultField = {
  label: '',
  type: 'text',
  component: GeneralField,
  validator: null,
  required: false,
};