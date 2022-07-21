import React, { useEffect, useState } from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {fetchUsers} from "../../api/userApi";
import {defaultAddEditQuestionFields} from "../../constants/default_fields";




const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));


export default function AddEditQuestion(){

  const classes = useStyles();
  const history = useHistory();
  const {id, option} = useParams();

  const [state, setState] = useState({
    loading: true,
    form:{
      ...defaultAddEditQuestionFields
    },
  })

  useEffect(() => {
    fetchUsers().then(data => {
      if(option === 'edit'){
        setState(state => ({...state, loading: false, form: data.form}));
      }else{
        setState(state => ({...state, loading: false}))
      }

    });
  }, []);


}