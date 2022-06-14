import { Validator } from "../helpers";
import { defaultField } from "./index";

export const userProfileFieldsEmail = {
    primary_email: {
        ...defaultField,
        required: true,
        label: 'Primary Email',
        type: 'primary email',
        validator: Validator.email,
    },
    secondary_email: {
        ...defaultField,
        label: 'Secondary Email',
        type: 'secondary email',
        validator: Validator.email,
    }
};

export const userProfileFields = {
    first_name: {
        ...defaultField,
        label: 'First name',
    },
    last_name: {
        ...defaultField,
        label: 'Last name',
    },
    primary_phone_number: {
        ...defaultField,
        label: 'Telephone',
        validator: Validator.phone,
    },
    alt_phone_number: {
        ...defaultField,
        label: 'Alternate phone number',
        validator: Validator.phone,
    }
};