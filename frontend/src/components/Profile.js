import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useParams} from "react-router";
import {Button, Container, Paper, Table, TableBody, Typography} from "@mui/material";
import TR from "./shared/TR";
import {fetchUser} from "../api/userApi";


const useStyles = makeStyles(() => ({
    root: {
        width: '80%'
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
    }
}));

// const [user, setUser] = useState({});
//
// const {id} = useParams();
// useEffect(() => {
//     fetchUser(id).then(user => {
//         setUser(user);
//     });
// }, [id]);

export default function Profile() {
    const classes = useStyles();

    const handleSubmit = async () => {
    };

    return (
        <Container className={classes.root}>
            <Typography variant="h5">
                {'User Profile'}
            </Typography>




            <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                Edit
            </Button>
        </Container>
    )
}