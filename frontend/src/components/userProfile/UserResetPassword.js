import React, {useEffect, useState, useContext} from 'react';
import {makeStyles} from "@mui/styles";
import {
    defaultCurrentPasswordFields,
    defaultNewPasswordFields,
    defaultUserFields
} from "../../constants/default_fields";
import {Button, Container, TextField, Typography} from "@mui/material";
import {
    newPasswordFields,
    updatePasswordFields
} from "../../constants/updatePasswordFields";
import {Link} from "../shared";
import {isFieldEmpty} from "../../helpers";
import {DUPLICATE_HELPER_TEXT, PASSWORD_NOT_MATCH_TEXT, REQUIRED_HELPER_TEXT, OLD_PASSWORD_ERR_MSG} from "../../constants";
import { useHistory } from "react-router-dom";
import {AlertDialog} from "../shared/Dialogs";
import {useParams} from "react-router";
import {UserContext} from "../../context";
import {login} from "../../api/auth";
import {checkCurrentPassword, saveNewPassword} from "../../api/userApi";

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
    const [form, setForm] = useState({...defaultCurrentPasswordFields});
    const [editNew, setEditNew] = useState(false);
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

            // let msg;
            // if (!isEmpty && option.validator && (msg = option.validator(form[field]))) {
            //     newErrors[field] = msg;
            // }

            // if (option.label === 'Repeat New Password') {
            //     if (form.newPassword === form.repeatNewPassword) {
            //         console.log("same");
            //     } else {
            //         console.log('different');
            //         newErrors[field] = PASSWORD_NOT_MATCH_TEXT;
            //     }
            // }
        }

        if (Object.keys(newErrors).length !== 0) {
            setErrors(newErrors);
            return false
        }
        return true;
    };

    // handler for submit button for old password
    const handleSubmitOld = async () => {
        if (validateOld()) {
            console.log('frontend validate passed')
            const {success} = await checkCurrentPassword(id, form.currentPassword);
            console.log(success)
            if (success) {
                setForm({...defaultNewPasswordFields});
                setEditNew(true);
            } else {
                alert('Your input password does not match your current password.');
                console.log('wrong current password.');
            }
        } else {
            console.log('validateOld() not passed.');
        }
    }

    // handler for submit button for new password
    const handleSubmitNew = () => {
        console.log(form)
        if (validateNew()) {
            console.log('frontend of new password validation passed')
            setDialogSubmit(true);
        }
    }

    // handler for submit button in confirmation dialog
    const handleConfirm = async () => {
        console.log(form.newPassword)
        const {success} = await saveNewPassword(id, form.newPassword);
        console.log(success);
        if (success) {
            //TODO: clear UserContext.
            console.log('valid')
            setDialogSubmit(false);
            history.push('/dashboard');
            alert('You have successfully changed your password.');
            try {
            } catch (e) {
                if (e.json) {
                    console.log(e.json);
                }
            }
        } else {
            alert('save new password failed, please try later.')
        }
    };

    // OnBlur handler
    const handleOnBlur = (e, field, option) => {
        // if (!isFieldEmpty(form[field]) && option.validator && !!option.validator(form[field]))
        //     setErrors({...errors, [field]: option.validator(form[field])});
        // else
        //     setErrors({...errors, [field]: undefined});

        if (!isFieldEmpty(form["repeatNewPassword"]) && field === "repeatNewPassword"
          && !!option.validator(form.repeatNewPassword, form.newPassword)) {
            setErrors({...errors, [field]: option.validator(form[field], form.newPassword)});
        } else if (!isFieldEmpty(form[field]) && field !== "repeatNewPassword" && option.validator
          && !!option.validator(form[field])) {
            setErrors({...errors, [field]: option.validator(form[field])});
        } else {
            setErrors({...errors, [field]: undefined});
        }
    };


    return (
        <Container className={classes.root}>
            {editNew ? (
                <Container className={classes.root}>
                    <Typography
                      variant="h6" color={'navy'}
                      style={{marginTop: '10px'}}>
                        {'Note that a strong and valid password should satisfy:'}
                    </Typography>
                    <Typography
                      variant="body1" color={'primary'}
                      style={{marginBottom: '5px'}}>
                        {'- Contain at least 8 characters.'}
                    </Typography>
                    <Typography
                      variant="body1" color={'primary'}
                      style={{marginBottom: '5px'}}>
                        {'- Contain upper case AND lower case letters.'}
                    </Typography>

                    <Typography
                      variant="body1" color={'primary'}
                      style={{marginBottom: '5px'}}>
                        {'- Contain at least 1 number and at least 1 punctuation mark.'}
                    </Typography>

                    <Typography variant="h5"
                                style={{marginTop: '20px'}}>
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