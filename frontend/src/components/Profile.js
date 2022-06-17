import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {Button, Container, Typography} from "@mui/material";
import {userProfileFields} from "../constants/userProfileFields";
import {fetchUser, updateUser} from "../api/userApi";
import {defaultUserFields} from "../constants/default_fields";
import {isFieldEmpty} from "../helpers";
import {REQUIRED_HELPER_TEXT} from "../constants";
import {AlertDialog} from "./shared/Dialogs";


export default function Profile() {
    const useStyles = makeStyles(() => ({
        root: {
            width: '80%'
        },
        button: {
            marginTop: 12,
            marginBottom: 12,
        }
    }));
    const classes = useStyles();
    const history = useHistory();
    const {id} = useParams();
    const mode = id == null ? 'new' : 'edit';
    const [state, setState] = useState({
        form: {
            ...defaultUserFields,
            first_name: 'Emolee',
            last_name: 'Cheng',
            primary_email: 'primaryEmail@gmail.com',
            secondary_email: 'secondaryEmail@gmail.com',
            telephone: "+1 (444) 444-4445",
            altTelephone: '+1 (623) 434-4444',
        },
        errors: {},
        dialog: false
        //loading: true,
    });


    /* deleted loading state*/
    useEffect(() => {
        if (mode === 'edit') {
            fetchUser(id).then(user => {
                setState(state => ({
                    ...state,
                    form: {
                        ...state.form,
                        ...user
                    }
                }))
            })
        } else
            setState(state => ({...state}));
    }, [mode, id]);


    const validate = () => {
        const errors = {};
        for (const [field, option] of Object.entries(userProfileFields)) {
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

        const Email1 = userProfileFields.primary_email.valueOf();
        const Email2 = userProfileFields.secondary_email.valueOf();
        if (Email1 === Email2) {
            setState(state => ({...state, errors}));
            return false
        }

        return true;
    };

    // const handleSubmit = async () => {
    //     if (validate()) {
    //         try {
    //             await updateUser(id, state.form);
    //             history.push('/users/' + id);
    //         } catch (e) {
    //             if (e.json) {
    //                 setState(state => ({...state, errors: e.json}));
    //             }
    //         }
    //     }
    // };

    const handleSubmit = () => {
        console.log(state.form)
        if (validate()) {
            setState(state => ({...state, dialog: true}))
        }
    }
    const handleCancel = () => {
        setState(state => ({...state, dialog: false}))
        console.log("cancel")
    }

    const handleConfirm = async () => {
        console.log('valid')
        try {
            await updateUser(id, state.form);
            history.push('/users/' + id);
        } catch (e) {
            if (e.json) {
                setState(state => ({...state, errors: e.json}));
            }
        }
    };

    const handleOnBlur = (e, field, option) => {
        if (!isFieldEmpty(state.form[field])
            && option.validator && !!option.validator(state.form[field]))
            // state.errors.field = option.validator(e.target.value)
            setState(state => ({...state,
                errors: {...state.errors, [field]: option.validator(state.form[field])}}))
        //console.log(state.errors)
        else
            setState(state => ({...state, errors: {...state.errors, [field]: undefined}}))
    };


    return (
        <Container className={classes.root}>
            <Typography variant="h5">
                {'User Profile'}
            </Typography>
            {Object.entries(userProfileFields).map(([field, option]) => {
                if (option.type ==='phoneNumber')
                return (
                    <option.component
                                //disabled={true}
                                key={field}
                                label={option.label}
                                type={option.type}
                                options={option.options}
                                value={state.form[field]}
                                required={option.required}
                                onChange={value => state.form[field] = value}
                                onBlur={e => handleOnBlur(e, field, option)}
                                error={!!state.errors[field]}
                                helperText={state.errors[field]}
                    />
                )
                if (option.type ==='info')
                    return (
                    <option.component
                        key={field}
                        label={option.label}
                        type={option.type}
                        options={option.options}
                        value={state.form[field]}
                        required={option.required}
                        onChange={e => state.form[field] = e.target.value}
                        onBlur={e => handleOnBlur(e, field, option)}
                        error={!!state.errors[field]}
                        helperText={state.errors[field]}
                    />
                )})}

            <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                Submit Changes
            </Button>


            {Object.entries(userProfileFields).map(([field, option]) => {
                if (option.label ==='Primary Email')
                return (
                        <option.component
                            //disabled={true}
                            key={field}
                            label={option.label}
                            type={option.type}
                            options={option.options}
                            value={state.form[field]}
                            required={option.required}
                            onChange={e => state.form[field] = e.target.value}
                            onBlur={e => handleOnBlur(e, field, option)}
                            error={!!state.errors[field]}
                            helperText={state.errors[field]}
                        />
                    )})}

            <Button variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSubmit}
                    style={{display: 'inline-block'}}>
                Submit Changes
            </Button>

            {Object.entries(userProfileFields).map(([field, option]) => {
                if (option.label ==='Secondary Email')
                return (
                        <option.component
                            //disabled={true}
                            key={field}
                            label={option.label}
                            type={option.type}
                            options={option.options}
                            value={state.form[field]}
                            required={option.required}
                            onChange={e => state.form[field] = e.target.value}
                            onBlur={e => handleOnBlur(e, field, option)}
                            error={!!state.errors[field]}
                            helperText={state.errors[field]}
                        />
                    )})}

            <Button variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSubmit}
                    style={{display: 'inline-block'}}>
                Submit Changes
            </Button>

            <AlertDialog
                dialogContentText={"Note that you won't be able to edit the information after clicking CONFIRM."}
                dialogTitle={'Are you sure to submit?'}
                buttons={[<Button onClick={handleCancel} key={'cancel'}>{'cancel'}</Button>,
                    <Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>]}
                // buttons={{'cancel': handleCancel, 'confirm': handleConfirm}}
                         open={state.dialog}/>

        </Container>
    )
}