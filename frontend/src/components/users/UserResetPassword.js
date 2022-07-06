import React, {useEffect, useState, useContext} from 'react';
import {makeStyles} from "@mui/styles";
import {defaultUserFields} from "../../constants/default_fields";
import {Button, Container, TextField, Typography} from "@mui/material";
import {
    newPasswordFields,
    updatePasswordFields
} from "../../constants/updatePasswordFields";
import {Link} from "../shared";
import {isFieldEmpty} from "../../helpers";
import {DUPLICATE_HELPER_TEXT, PASSWORD_NOT_MATCH_TEXT, REQUIRED_HELPER_TEXT} from "../../constants";
import { useHistory } from "react-router-dom";
import {AlertDialog} from "../shared/Dialogs";
import {useParams} from "react-router";
import {UserContext} from "../../context";
import {login} from "../../api/auth";
import {checkCurrentPassword} from "../../api/userApi";
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
    const [errors, setErrors] = useState({});
    const [dialogSubmit, setDialogSubmit] = useState(false);
    const [loading, setLoading] = useState(true);
    const currentPasswordForm = {currentPassword: ''}
    const [form, setForm] = useState(currentPasswordForm);
    const [editNew, setEditNew] = useState(false);
    const newPasswordForm = {
        newPassword:'',
        repeatNewPassword:'',
    };

    // const [state, setState] = useState({
    //     form: {
    //         ...defaultUserFields
    //     }
    //     //loading: true,
    // });

    let history = useHistory();

    // helper function for validating the text field for old password
    const validateOld = () => {
        const newErrors = {};
        for (const [field, option] of Object.entries(updatePasswordFields)) {
            const isEmpty = isFieldEmpty(form[field]);
            if (option.required && isEmpty) {
                newErrors[field] = REQUIRED_HELPER_TEXT;}}
        if (Object.keys(newErrors).length !== 0) {
            setErrors(newErrors);
            return false;}

        return true;
    };


    // helper function for validating the text field for new password
    const validateNew = () => {
        const newErrors = {};
        for (const [field, option] of Object.entries(newPasswordFields)) {
            const isEmpty = isFieldEmpty(form[field]);
            if (option.required && isEmpty) {
                newErrors[field] = REQUIRED_HELPER_TEXT;
            }

            let msg;
            if (!isEmpty && option.validator && (msg = option.validator(form[field]))) {
                newErrors[field] = msg;
            }

            if (option.label === 'Repeat New Password') {
                if (form.newPassword === form.repeatNewPassword) {
                    console.log("same");
                } else {
                    console.log('different');
                    newErrors[field] = PASSWORD_NOT_MATCH_TEXT;
                }
            }
        }

        if (Object.keys(newErrors).length !== 0) {
            setErrors(newErrors);
            return false
        }
        return true;
    };

    // handler for submit button for old password
    const handleSubmitOld = () => {
        console.log(form)
        console.log(form.currentPassword);
        if (validateOld()) {
            console.log('frontend validate passed')
            //const {success} = checkCurrentPassword(id, form.currentPassword);
            //console.log(success)
            if (true) {
                setForm(newPasswordForm);
                setEditNew(true);
            } else {
                console.log('reached error');
            }
        } else {
            console.log('validateOld() not passed.')
        }
    }

    // handler for submit button for new password
    const handleSubmitNew = () => {
        console.log(form)
        if (validateNew()) {
            setDialogSubmit(true);
        }
    }

    // handler for submit button in confirmation dialog
    const handleConfirm = async () => {
        if (true) {
            console.log('valid')
            history.push('/Dashboard');
            try {
            } catch (e) {
                if (e.json) {
                    console.log(e.json);
                }
            }
        }
    };

    // OnBlur handler
    const handleOnBlur = (e, field, option) => {
        if (!isFieldEmpty(form[field]) && option.validator && !!option.validator(form[field]))
            // state.errors.field = option.validator(e.target.value)
            setErrors({...errors, [field]: option.validator(form[field])});
        //console.log(state.errors)
        else
            setErrors({...errors, [field]: undefined});
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
                                value={form[field]}
                                required={option.required}
                                onChange={value => form[field] = value.target.value}
                                onBlur={e => handleOnBlur(e, field, option)}
                                error={!!errors[field]}
                                helperText={errors[field]}
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
                                  value={form[field]}
                                  required={option.required}
                                  onChange={value => form[field] = value.target.value}
                                  onBlur={e => handleOnBlur(e, field, option)}
                                  error={!!errors[field]}
                                  helperText={errors[field]}
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
                             buttons={[<Button onClick={() => setDialogSubmit(false)} key={'cancel'}>{'cancel'}</Button>,
                                 <Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>]}
                             open={dialogSubmit}/>
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
                                  value={form[field]}
                                  required={option.required}
                                  onChange={value => form[field] = value.target.value}
                                  onBlur={e => handleOnBlur(e, field, option)}
                                  error={!!errors[field]}
                                  helperText={errors[field]}
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