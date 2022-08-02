import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context";

export default function AdminRoute({element: Component, ...rest}) {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  if (!userContext.isAdmin) {
    navigate('/login-pane');
    return '';
  }
  return <Component {...rest}/>;
}
