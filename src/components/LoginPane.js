import React, { Component } from 'react'

import { Row, Col } from 'react-bootstrap';

// components
import LoginForm from './login/LoginForm.js';

// styles
import '../stylesheets/Login.scss';


class LoginPane extends Component {
  render() {
    return(
      <Row className="content login-pane">
        <h3>Sign in</h3>
        <Col md={12}>
          <LoginForm />
        </Col>
      </Row>
    )
  }
}

export default LoginPane;
