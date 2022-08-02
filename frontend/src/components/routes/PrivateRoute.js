import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context";

export default function PrivateRoute({element: Component, ...rest}) {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  if (!userContext.email) {
    navigate('/login-pane');
    return '';
  }
  return <Component {...rest}/>;
}
