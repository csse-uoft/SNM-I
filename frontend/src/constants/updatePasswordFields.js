import { Validator } from "../helpers";
import { defaultField } from "./index";

export const updatePasswordFields = {
    password: {
        ...defaultField,
        required: true,
        label: 'Old Password',
        type: 'password',
        validator: Validator.oldPassword,
    }
};

export const newPasswordFields = {
     new_password: {
        ...defaultField,
        required: true,
        label: 'New Password',
        type: 'password',
        validator: Validator.password,
    },
    repeat_password: {
        ...defaultField,
        required: true,
        label: 'Repeat New Password',
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