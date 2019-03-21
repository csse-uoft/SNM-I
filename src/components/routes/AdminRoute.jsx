import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const AdminRoute = ({ component: Component, isLoggedin, isAdmin, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isLoggedin === true && isAdmin === true) ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login-pane" />
      )
    }
  />
);

const mapStateToProps = (state) => {
  return {
    isAdmin: state.auth.currentUser && state.auth.currentUser.is_admin,
    isLoggedin: state.auth.isLoggedin
  }
}

export default connect(mapStateToProps) (AdminRoute);
