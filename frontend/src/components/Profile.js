import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {Box, Button, Container, Grid, Paper, Stack, Table, TableBody, Typography} from "@mui/material";
import {userProfileFields} from "../constants/userProfileFields";
import {fetchUser, updateUser} from "../api/userApi";
import {defaultUserFields} from "../constants/default_fields";
import {isFieldEmpty} from "../helpers";
import {REQUIRED_HELPER_TEXT} from "../constants";
import useProfileTableStyles from "../stylesheets/profile-table";


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
    const [edit, setIsEdit] = useState(false);
    const userEdit = () => setIsEdit(true);
    const [state, setState] = useState({
        form: {
            ...defaultUserFields,
            first_name: 'Emolee',
            last_name: 'Cheng',
            primary_email: 'primaryEmail@gmail.com',
            secondary_email: 'secondaryEmail@gmail.com',
            primary_phone_number: '6470000000',
            alt_phone_number: '6471111111',
        },
        errors: {},
        //loading: true,
    });

    /* hardcode preset*/

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
        return true;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                await updateUser(id, state.form);
                history.push('/users/' + id);
            } catch (e) {
                if (e.json) {
                    setState(state => ({...state, errors: e.json}));
                }
            }
        }
    };

    const handleEdit = async () => {

    };

    return (
        <Container className={classes.root}
                   //style={useProfileTableStyles}
        >
            <Typography variant="h5">
                {'User Profile'}
            </Typography>
            {Object.entries(userProfileFields).map(([field, option]) => {
                return (
                    <div>
                        <Table style={{display:'inline'}}>
                            <option.component
                                //disabled={true}
                                key={field}
                                label={option.label}
                                type={option.type}
                                options={option.options}
                                value={state.form[field]}
                                required={option.required}
                                onChange={e => state.form[field] = e.target.value}
                                error={!!state.errors[field]}
                                helperText={state.errors[field]}
                                //style={{display:'inline-block'}}
                            />
                        </Table>
                        &nbsp;
                        <div style={{display:'inline'}}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={handleSubmit}>
                                Submit Changes
                            </Button>
                        </div>
                    </div>
                )
            })}

            {/*<Button variant="contained" color="primary" className={classes.button} onClick={handleEdit}>*/}
            {/*    Edit*/}
            {/*</Button>*/}
            {/*&nbsp;&nbsp;&nbsp;*/}
            {/*<Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>*/}
            {/*    Submit Changes*/}
            {/*</Button>*/}

        </Container>
    )
}