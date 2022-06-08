import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from "../../context";


export default function AdminRoute({component: Component, ...rest}) {
  const userContext = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={props => userContext.isAdmin ? <Component {...props} /> : <Redirect to="/login-pane"/>}
    />
  )
}
