import GeneralField from "../components/shared/fields/GeneralField";

export const UN_SET = 'UN_SET';
export const REQUIRED_HELPER_TEXT = 'This field is required';
export const DUPLICATE_HELPER_TEXT =
    'Your secondary email must be different from the primary email.';
export const DUPLICATE_PHONE_HELPER_TEXT =
    'Your alternate telephone must be different from the first telephone number.';
export const OLD_PASSWORD_ERR_MSG = "Your input doesn't match the old password, please try again.";
export const PASSWORD_NOT_MATCH_TEXT =
    'Your repeat password does not match, please try again.';

export const defaultField = {
  label: '',
  type: 'text',
  component: GeneralField,
  validator: null,
  required: false,
};