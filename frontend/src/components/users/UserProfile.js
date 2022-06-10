import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import {fetchUser} from "../../api/userApi";

export default function UserProfile() {
    const dispatch = useDispatch();
    const {id} = useParams();

    const [state, setState] = useState({
        data: null,
        formSetting: null
    });


    useEffect(() => {
            fetchUser(id).then(data => {
                setState(state => ({
                    ...state,
                    data
                }))
            })
        }, [id]
    );

    useEffect(() => {
            if (state.formSetting == null) {
                fetchUser(false).then(json => {
                    setState(state => ({
                        ...state,
                        formSetting: json
                    }))
                })
            }
        }, [dispatch, state.formSetting]
    );
    if (state.data && state.formSetting) {

        return (
            <h1>You Reach Here</h1>
        )
    } else {
        return '';
    }
}