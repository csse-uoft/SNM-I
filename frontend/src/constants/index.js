import GeneralField from "../components/shared/fields/GeneralField";

export const UN_SET = 'UN_SET';
export const REQUIRED_HELPER_TEXT = 'This field is required';

export const defaultField = {
  label: '',
  type: 'text',
  component: GeneralField,
  validator: null,
  required: false,
};