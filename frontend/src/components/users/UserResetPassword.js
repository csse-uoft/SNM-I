import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {defaultUserFields} from "../../constants/default_fields";
import {Button, Container, TextField, Typography} from "@mui/material";
import {updatePasswordFields} from "../../constants/updatePasswordFields";
import {userProfileFields} from "../../constants/userProfileFields";


const useStyles = makeStyles(() => ({
    root: {
        width: '80%'
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
    }
}));


export default function UserResetPassword() {
    const classes = useStyles();
    const [state, setState] = useState({
        form: {
            ...defaultUserFields
        },
        errors: {},
        //loading: true,
    });


    const handleSubmit = async () => {
        /* send to backend to check */

    };

    return (
        <Container className={classes.root}>
            <Typography variant="h5">
                {'Reset Password'}
            </Typography>

            {Object.entries(updatePasswordFields).map(([field, option]) => {
                return (
                    <option.component
                        key={field}
                        label={option.label}
                        type={option.type}
                        options={option.options}
                        value={state.form[field]}
                        required={option.required}
                        onChange={e => state.form[field] = e.target.value}
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