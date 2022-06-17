import { Validator } from "../helpers";
import { defaultField } from "./index";

export const updatePasswordFields = {
    old_password: {
        ...defaultField,
        required: true,
        label: 'Password',
        type: 'password',
        validator: Validator.password,
    }

};

export const NewPasswordFields = {
    new_password: {
        ...defaultField,
        required: true,
        label: 'Password',
        type: 'password',
        validator: Validator.password,
    }

};

export const RepeatPasswordFields = {
    repeat_password: {
        ...defaultField,
        required: true,
        label: 'Password',
        type: 'password',
        validator: Validator.password,
    }

};