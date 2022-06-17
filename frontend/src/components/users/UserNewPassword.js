import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {defaultUserFields} from "../../constants/default_fields";
import {Button, Container, TextField, Typography} from "@mui/material";
import {NewPasswordFields, updatePasswordFields} from "../../constants/updatePasswordFields";


const useStyles = makeStyles(() => ({
    root: {
        width: '80%'
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
    }
}));


export default function UserNewPassword() {
    const classes = useStyles();
    const [state, setState] = useState({
        form: {
            ...defaultUserFields
        },
        errors: {},
        //loading: true,
    });


    const validate = () => {
        return true;
    };

    const handleSubmit = () => {
        console.log(state.form)
        if (validate()) {
            setState(state => ({...state, dialog: true}))
        }
    }

    return (
        <Container className={classes.root}>
            <Typography
                variant="h5"
                style={{marginTop: '10px'}}>
                {'Please enter your new password:'}
            </Typography>


            {Object.entries(NewPasswordFields).map(([field, option]) => {
                return (
                    <option.component
                        key={field}
                        //label={option.label}
                        type={option.type}
                        options={option.options}
                        value={state.form[field]}
                        required={option.required}
                        onChange={e => state.form[field] = e.target.value}
                        error={!!state.errors[field]}
                        helperText={state.errors[field]}
                        style={{marginTop: '10px'}}
                    />
                )
            })}


            <Typography variant="h5"
                        style={{marginTop: '20px'}}>
                {'Please repeat your new password:'}
            </Typography>


            {Object.entries(NewPasswordFields).map(([field, option]) => {
                return (
                    <option.component
                        key={field}
                        //label={option.label}
                        type={option.type}
                        options={option.options}
                        value={state.form[field]}
                        required={option.required}
                        onChange={e => state.form[field] = e.target.value}
                        error={!!state.errors[field]}
                        helperText={state.errors[field]}
                        style={{marginTop: '10px'}}
                    />
                )
            })}

            <Button
                variant="contained"
                color="primary"
                style={{marginTop: '20px'}}
                className={classes.button}
                onClick={handleSubmit}>
                Submit
            </Button>
        </Container>
    )
}