import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, isLoggedin, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedin === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login-pane" />
      )
    }
  />
);

const mapStateToProps = (state) => {
  return {
    isLoggedin: state.auth.isLoggedin
  }
}

export default connect(mapStateToProps)(PrivateRoute);
