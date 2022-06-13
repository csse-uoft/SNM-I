import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory} from "react-router";
import {defaultUserFields} from "../../constants/default_fields";
import {userInvitationFields} from "../../constants/userInvitationFields";
import {isFieldEmpty} from "../../helpers";
import {REQUIRED_HELPER_TEXT} from "../../constants";
import {createUser, fetchUser} from "../../api/userApi";
import {Button, Container, Typography} from "@mui/material";
import {Link} from "../shared";


const useStyles = makeStyles(() => ({
    root: {
        width: '80%'
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
    }
}));

const columns = [
    {
        label: 'Username',
        body: ({user}) =>  <Link color to={`/users/${user.id}`}>
            {user.username}
        </Link>
    },
    {
        label: 'Action',
        body: ({user}) =>  <Link color to={`/users/${user.id}`}>
            {user.password}
        </Link>
    }
];

export default function UserResetPassword() {
    const classes = useStyles();

    const handleSubmit = async () => {

    };


    return (
        <Container className={classes.root}>
            <Typography variant="h5">
                {'Reset Password'}
            </Typography>

            <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                Submit
            </Button>
        </Container>
    )
}