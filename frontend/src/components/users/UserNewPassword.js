import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {defaultResetPassword, defaultUserFields} from "../../constants/default_fields";
import {Button, Container, TextField, Typography} from "@mui/material";
import {NewPasswordFields, RepeatPasswordFields} from "../../constants/updatePasswordFields";
import {isFieldEmpty} from "../../helpers";
import {PASSWORD_NOT_MATCH_TEXT, REQUIRED_HELPER_TEXT} from "../../constants";
import _ from "lodash";
import {userInvitationFields} from "../../constants/userInvitationFields";
import {createUser} from "../../api/userApi";
import {AlertDialog} from "../shared/Dialogs";


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
            ...defaultResetPassword
        },
        errors: {},
        //loading: true,
    });


    const validate1 = () => {
        const errors = {};

        for (const [field, option] of Object.entries(NewPasswordFields)) {
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


    const validate2 = () => {
        const errors = {};

        for (const [field, option] of Object.entries(RepeatPasswordFields)) {
            const isEmpty = isFieldEmpty(state.form[field]);
            if (option.required && isEmpty) {
                errors[field] = REQUIRED_HELPER_TEXT;
            }
            if (!_.isEqual(NewPasswordFields, RepeatPasswordFields)) {
                errors[field] = PASSWORD_NOT_MATCH_TEXT;
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

    const validate3 = () => {
        const errors = {};
        const newPassword = state.form.new_password;
        const repeatPassword = state.form.repeat_password;

        for (const [field, option] of Object.entries(RepeatPasswordFields)) {
            if (newPassword === repeatPassword) {
                console.log("same");
            } else {
                console.log('different');
                errors[field] = PASSWORD_NOT_MATCH_TEXT;
            }
        }

        if (Object.keys(errors).length !== 0) {
            setState(state => ({...state, errors}));
            return false
        }

        return true;
    }


    const handleCancel = () => {
        setState(state => ({...state, dialog: false}))
        console.log("cancel")
    }

    const handleConfirm = async () => {
        if (true) {
            console.log('valid')
            try {
                // if (mode === 'new') {
                //await createUser(state.form);
                //history.push('/users/');
                // } else {
                //   await updateUser(id, state.form);
                //   history.push('/users/' + id);
                // }

            } catch (e) {
                if (e.json) {
                    setState(state => ({...state, errors: e.json}));
                }
            }
        }
    };

    const handleSubmit = () => {
        console.log(state.form);
        if (validate1()) {
            setState(state => ({...state, dialog: true}))
        }
    };

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
                        //onChange={e => state.form[field] = e.target.value}
                        onChange={value => state.form[field] = value}
                        onBlur={e => handleOnBlur(e, field, option)}
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


            {Object.entries(RepeatPasswordFields).map(([field, option]) => {
                return (
                    <option.component
                        key={field}
                        //label={option.label}
                        type={option.type}
                        options={option.options}
                        value={state.form[field]}
                        required={option.required}
                        //onChange={e => state.form[field] = e.target.value}
                        onChange={value => state.form[field] = value}
                        onBlur={e => handleOnBlur(e, field, option)}
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

            <AlertDialog dialogContentText={"Note that you won't be able to edit the information after clicking CONFIRM."}
                         dialogTitle={'Are you sure to submit?'}
                         buttons={[<Button onClick={handleCancel} key={'cancel'}>{'cancel'}</Button>,
                             <Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>]}
                // buttons={{'cancel': handleCancel, 'confirm': handleConfirm}}
                         open={state.dialog}/>
        </Container>
    )
}