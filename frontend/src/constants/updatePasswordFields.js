import { Validator } from "../helpers";
import { defaultField } from "./index";

export const updatePasswordFields = {
    currentPassword: {
        ...defaultField,
        required: true,
        label: 'Old Password',
        type: 'password',
        validator: Validator.oldPassword,
    }
};

export const newPasswordFields = {
     newPassword: {
        ...defaultField,
        required: true,
        label: 'New Password',
        type: 'password',
        validator: Validator.password,
    },
    repeatNewPassword: {
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