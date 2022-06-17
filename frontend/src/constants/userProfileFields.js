import { Validator } from "../helpers";
import { defaultField } from "./index";

export const userProfileFields = {
    first_name: {
        ...defaultField,
        label: 'First name',
        type: 'info',
    },
    last_name: {
        ...defaultField,
        label: 'Last name',
        type: 'info',
    },
    telephone: {
        ...defaultField,
        label: 'Telephone',
        type: 'phoneNumber',
        validator: Validator.phone,
    },
    altTelephone: {
        ...defaultField,
        label: 'AltTelephone',
        type: 'phoneNumber',
        validator: Validator.phone,
    },
    primary_email: {
        ...defaultField,
        required: true,
        label: 'Primary Email',
        type: 'email',
        validator: Validator.email,
    },
    secondary_email: {
        ...defaultField,
        label: 'Secondary Email',
        type: 'email',
        validator: Validator.email,
    }
};

// export const userPrimaryEmail = {
// primary_email: {
//         ...defaultField,
//         required: true,
//         label: 'Primary Email',
//         type: 'email',
//         validator: Validator.email,
//     }
// };
//
// export const userSecondaryEmail = {
//     secondary_email: {
//         ...defaultField,
//         label: 'Secondary Email',
//         type: 'email',
//         validator: Validator.email,
//     }
// };