import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import React, {useState} from "@types/react";
import {defaultNewPasswordFields} from "../constants/default_fields";
import {Loading} from "./shared";
import {verifyForgotPasswordUser} from "../api/userApi";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));

export default function ResetPassword(){
  const classes = useStyles();
  const history = useHistory();
  const {token} = useParams();

  const [state, setState] = useState({
    form: {
      ...defaultNewPasswordFields
    },
    errors: {},
    submitDialog: false,
    successDialog: false,
    failDialog: false,
    verified: 0, // 0 means haven't verified, 1 means verified, 2 means fail to verified
    loading: true,
    email: '',
    id:'',
    failMessage:''
  });

  if (state.loading)
    return <Loading message={`Loading`}/>;

  const verifyToken = async (token) => {
    try{
      await verifyForgotPasswordUser(token)
    }catch (e){

    }
  }

  if (!state.verified){
    verifyToken(token)
  }


}