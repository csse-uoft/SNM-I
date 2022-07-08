import React, {useEffect, useState, useContext} from 'react';
import {makeStyles} from "@mui/styles";
import {
    defaultCurrentPasswordFields,
    defaultNewPasswordFields,
} from "../../constants/default_fields";
import {Button, Container, Typography} from "@mui/material";
import {
    newPasswordFields,
    updatePasswordFields
} from "../../constants/updatePasswordFields";
import {isFieldEmpty} from "../../helpers";
import {REQUIRED_HELPER_TEXT} from "../../constants";
import { useHistory } from "react-router-dom";
import {AlertDialog} from "../shared/Dialogs";
import {useParams} from "react-router";
import {checkCurrentPassword, saveNewPassword} from "../../api/userApi";
import LoadingButton from "../shared/LoadingButton";


const useStyles = makeStyles(() => ({
    root: {
        width: '80%'
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
    }
}));

/**
 * This function is for reset password in user profile page.
 * @returns {JSX.Element}
 * @constructor
 */
export default function UserResetPassword() {
    const classes = useStyles();
    const {id} = useParams();
    const [errors, setErrors] = useState({});
    const [dialogSubmit, setDialogSubmit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({...defaultCurrentPasswordFields});
    const [editNew, setEditNew] = useState(false);
    const [dialogConfirmed, setDialogConfirmed] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    let history = useHistory();

    /**
     * This validates the correctness of current password.
     * @returns {boolean}
     */
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


    /**
     * This validates the correctness of new password.
     * @returns {boolean}
     */
    const validateNew = () => {
        const newErrors = {};
        for (const [field, option] of Object.entries(newPasswordFields)) {
            const isEmpty = isFieldEmpty(form[field]);
            if (option.required && isEmpty) {
                newErrors[field] = REQUIRED_HELPER_TEXT;
            }
        }

        if (Object.keys(newErrors).length !== 0) {
            setErrors(newErrors);
            return false
        }
        return true;
    };

    /**
     * handler for submit current password.
     * @returns {Promise<void>}
     */
    const handleSubmitOld = async () => {
        if (validateOld()) {
            setLoadingButton(true);
            const {success} = await checkCurrentPassword(id, form.currentPassword);
            console.log(success)
            if (success) {
                setLoadingButton(false);
                setForm({...defaultNewPasswordFields});
                setEditNew(true);
            } else {
                setLoadingButton(false);
                //TODO: change this alert to dialog.
                alert('Your input password does not match your current password.');
                console.log('wrong current password.');
            }
        } else {
            console.log('validateOld() not passed.');
        }
    }

    /**
     * handler for submit new password.
     */
    const handleSubmitNew = () => {
        console.log(form)
        if (validateNew()) {
            setDialogSubmit(true);
        }
    }

    /**
     * handler for the button in dialog notify user changed password successfully.
     */
    const handleDialogConfirmed = () => {
        setDialogConfirmed(false);
        history.push('/dashboard');
    }

    /**
     * handler for the confirm button in the dialog pops after click submit new password.
     * @returns {Promise<void>}
     */
    const handleConfirm = async () => {
        setLoadingButton(true);
        const {success} = await saveNewPassword(id, form.newPassword);
        if (success) {
            setLoadingButton(false);
            setDialogSubmit(false);
            setDialogConfirmed(true);
            try {
            } catch (e) {
                if (e.json) {
                    console.log(e.json);
                }
            }
        } else {
            setLoadingButton(false);
            alert('save new password failed, please try again.')
        }
    };

    // OnBlur handler
    const handleOnBlur = (e, field, option) => {
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

                <AlertDialog dialogContentText={"Note that you won't be able to edit the information after clicking CONFIRM."}
                             dialogTitle={'Are you sure to submit?'}
                             buttons={[<Button onClick={() => setDialogSubmit(false)} key={'cancel'}>{'cancel'}</Button>,
                                 //<Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>
                                 <LoadingButton noDefaultStyle variant="text" color="primary"
                                                loading={loadingButton} key={'Confirm New'}
                                                onClick={handleConfirm}>{'confirm'}</LoadingButton>]}
                             open={dialogSubmit}/>
                    <AlertDialog
                      dialogContentText={"You have successfully changed your password. Click the " +
                        "button below to be redirected to the Dashboard."}
                      dialogTitle={'Congratulation!'}
                      buttons={<Button onClick={handleDialogConfirmed} key={'redirect'} autoFocus> {'redirect'}</Button>}
                      open={dialogConfirmed}/>
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

                    <LoadingButton noDefaultStyle variant="contained" color="primary"
                                   loading ={loadingButton} key={'check old'} style={{marginTop: '10px'}}
                                   onClick={handleSubmitOld}/>

                </Container>
            )}

        </Container>
    )
}