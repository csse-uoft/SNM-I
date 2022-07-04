import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {defaultUserFields} from "../constants/default_fields";
import {Button, Container, TextField, Typography} from "@mui/material";
import {confirmEmailFields, updatePasswordFields} from "../constants/updatePasswordFields";
import {Link} from "./shared";
import {isFieldEmpty} from "../helpers";
import {REQUIRED_HELPER_TEXT} from "../constants";
import { useHistory } from "react-router-dom";


const useStyles = makeStyles(() => ({
    root: {
        width: '80%'
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
    }
}));


export default function EmailConfirm() {
    const classes = useStyles();
    const [state, setState] = useState({
        form: {
            ...defaultUserFields
        },
        errors: {},
        //loading: true,
    });

    let history = useHistory();

    const validate = () => {

        const errors = {};
        for (const [field, option] of Object.entries(confirmEmailFields)) {
            const isEmpty = isFieldEmpty(state.form[field]);
            if (option.required && isEmpty) {
                errors[field] = REQUIRED_HELPER_TEXT;
            }
            let msg;
            if (!isEmpty && option.validator && (msg = option.validator(state.form[field]))) {
                errors[field] = msg;
            }
        }
        if (Object.keys(errors).length !== 0) {
            setState(state => ({...state, errors}));
            return false
        }
        return true;
    };

    const handleSubmit = () => {
        console.log(state.form)
        if (validate()) {
            setState(state => ({...state}));
            history.push('/users/new-password');
        }
    }


    return (
        <Container className={classes.root}>
            <Typography variant="h5">
                {'Please enter your email below:'}
            </Typography>


            {Object.entries(confirmEmailFields).map(([field, option]) => {
                return (
                    <option.component
                        key={field}
                        //label={option.label}
                        type={option.type}
                        options={option.options}
                        value={state.form[field]}
                        required={option.required}
                        onChange={e => state.form[field] = e.target.value}
                        //onBlur={e => handleOnBlur(e, field, option)}
                        error={!!state.errors[field]}
                        helperText={state.errors[field]}
                    />
                )
            })}

            <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                Submit
            </Button>

        </Container>
    )
}