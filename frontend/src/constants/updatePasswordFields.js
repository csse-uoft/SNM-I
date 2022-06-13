import { Validator } from "../helpers";
import { defaultField } from "./index";

export const updatePasswordFields = {
    primary_email: {
        ...defaultField,
        required: true,
        label: 'Password',
        type: 'password',
        validator: Validator.password,
    }

};