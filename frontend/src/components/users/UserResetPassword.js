import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {defaultUserFields} from "../../constants/default_fields";
import {Button, Container, TextField, Typography} from "@mui/material";
import {
    newPasswordFields,
    NewPasswordFields,
    RepeatPasswordFields,
    updatePasswordFields
} from "../../constants/updatePasswordFields";
import {Link} from "../shared";
import {isFieldEmpty} from "../../helpers";
import {PASSWORD_NOT_MATCH_TEXT, REQUIRED_HELPER_TEXT} from "../../constants";
import { useHistory } from "react-router-dom";
import {AlertDialog} from "../shared/Dialogs";
import {useParams} from "react-router";
import {useContext} from "@types/react";
import {UserContext} from "../../context";
import {userProfileFields} from "../../constants/userProfileFields";

/* Page for password reset, functionalities including:
*   - reset password
* */

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
    const {id} = useParams();
    const userContext = useContext(UserContext);
    const [form, setForm] = useState({...userProfileFields});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState({
        form: {
            ...defaultUserFields
        },
        errors: {},
        dialog: false,
        //loading: true,
    });

    const [editNew, setEditNew] = useState(false)

    let history = useHistory();

    // helper function for validating the text field for old password
    const validateOld = () => {
        const errors = {};
        for (const [field, option] of Object.entries(updatePasswordFields)) {
            console.log(state.form.password.valueOf());
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


    // helper function for validating the text field for new password
    const validateNew = () => {
        const errors = {};

        for (const [field, option] of Object.entries(newPasswordFields)) {
            const isEmpty = isFieldEmpty(state.form[field]);
            if (option.required && isEmpty) {
                errors[field] = REQUIRED_HELPER_TEXT;
            }

            let msg;
            if (!isEmpty && option.validator && (msg = option.validator(state.form[field]))) {
                errors[field] = msg;
            }

            if (option.label === 'Repeat New Password') {
                if (state.form.new_password.valueOf() === state.form.repeat_password.valueOf()) {
                    console.log("same");
                } else {
                    console.log('different');
                    errors[field] = PASSWORD_NOT_MATCH_TEXT;
                }
            }
        }

        if (Object.keys(errors).length !== 0) {
            setState(state => ({...state, errors}));
            return false
        }
        return true;
    };

    // handler for submit button for old password
    const handleSubmitOld = () => {
        console.log(state.form)
        if (validateOld()) {
            setState(state => ({...state}));
            setEditNew(true);
        }
    }

    // handler for submit button for new password
    const handleSubmitNew = () => {
        console.log(state.form)
        if (validateNew()) {
            setState(state => ({...state, dialog: true}));
        }
    }

    // handler for cancel button in confirmation dialog
    const handleCancel = () => {
        setState(state => ({...state, dialog: false}))
        console.log("cancel")
    }

    // handler for submit button in confirmation dialog
    const handleConfirm = async () => {
        if (true) {
            console.log('valid')
            history.push('/Dashboard');
            try {
            } catch (e) {
                if (e.json) {
                    setState(state => ({...state, errors: e.json}));
                }
            }
        }
    };

    // OnBlur handler
    const handleOnBlur = (e, field, option) => {
        if (!isFieldEmpty(state.form[field]) && option.validator && !!option.validator(state.form[field]))
            // state.errors.field = option.validator(e.target.value)
            setState(state => ({...state, errors: {...state.errors, [field]: option.validator(state.form[field])}}))
        //console.log(state.errors)
        else
            setState(state => ({...state, errors: {...state.errors, [field]: undefined}}))
    };


    return (
        <Container className={classes.root}>
            {editNew ? (
                <Container className={classes.root}>

                <Typography
                    variant="h5"
                    style={{marginTop: '10px'}}>
                    {'Please enter your new password:'}
                </Typography>

                {/* text field for new password */}
                {Object.entries(newPasswordFields).map(([field, option]) => {
                    if (option.label === 'New Password'){
                        return (
                            <option.component
                                key={field}
                                label={option.label}
                                type={option.type}
                                options={option.options}
                                value={state.form[field]}
                                required={option.required}
                                onChange={e => state.form[field] = e.target.value}
                                //onChange={value => state.form[field] = value}
                                onBlur={e => handleOnBlur(e, field, option)}
                                error={!!state.errors[field]}
                                helperText={state.errors[field]}
                                style={{marginTop: '10px'}}
                            />
                        )
                    }})}


                <Typography variant="h5"
                            style={{marginTop: '20px'}}>
                    {'Please repeat your new password:'}
                </Typography>

                    {/* text field for repeat new password */}
                    {Object.entries(newPasswordFields).map(([field, option]) => {
                        if (option.label === 'Repeat New Password'){
                            return (
                                <option.component
                                    key={field}
                                    label={option.label}
                                    type={option.type}
                                    options={option.options}
                                    value={state.form[field]}
                                    required={option.required}
                                    onChange={e => state.form[field] = e.target.value}
                                    //onChange={value => state.form[field] = value}
                                    onBlur={e => handleOnBlur(e, field, option)}
                                    error={!!state.errors[field]}
                                    helperText={state.errors[field]}
                                    style={{marginTop: '10px'}}
                                />
                            )
                        }})}

                {/* new password submit button */}
                <Button
                    variant="contained"
                    color="primary"
                    style={{marginTop: '20px'}}
                    className={classes.button}
                    onClick={handleSubmitNew}>
                    Submit
                </Button>

                {/* confirmation dialog */}
                <AlertDialog dialogContentText={"Note that you won't be able to edit the information after clicking CONFIRM."}
                             dialogTitle={'Are you sure to submit?'}
                             buttons={[<Button onClick={handleCancel} key={'cancel'}>{'cancel'}</Button>,
                                 <Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>]}
                             open={state.dialog}/>
            </Container>) : (
                <Container className={classes.root}>
                    <Typography variant="h5">
                        {'Please enter your old password below:'}
                    </Typography>

                    {/* text field for old password */}
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
                                    //onChange={value => state.form[field] = value}
                                    //onBlur={e => handleOnBlur(e, field, option)}
                                    error={!!state.errors[field]}
                                    helperText={state.errors[field]}
                                    style={{marginTop: '10px'}}
                                />
                            )
                        })}

                    {/* old password submit button */}
                    <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitOld}>
                        Submit
                    </Button>

                </Container>
            )}

        </Container>
    )
}