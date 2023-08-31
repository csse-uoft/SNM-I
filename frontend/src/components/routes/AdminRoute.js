import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context";
import {useSnackbar} from "notistack";

export default function AdminRoute({element: Component, ...rest}) {
  const userContext = useContext(UserContext);
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userContext.email) {
      navigate('/login');
    }
  }, [userContext.email])

  if (!userContext.email) {
    enqueueSnackbar("You are not logged in.")
    return "Please wait..."
  }
  return <Component {...rest}/>;
}
