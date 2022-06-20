import { Validator } from "../helpers";
import { defaultField } from "./index";

export const updatePasswordFields = {
    old_password: {
        ...defaultField,
        required: true,
        label: 'Password',
        type: 'password',
        validator: Validator.oldPassword,
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


export const confirmEmailFields = {
    confirm_email: {
        ...defaultField,
        required: true,
        label: 'email',
        type: 'email',
        validator: Validator.confirmEmail,
    }

};