import React, { Component } from 'react'

import { Row, Col } from 'react-bootstrap';

// components
import LoginButtons from './login/LoginButtons.js';

// styles
import '../stylesheets/Login.scss';


class Login extends Component {
  render() {
    return(
      <Row className="content login-pane">
        <h3>Log in to your Dashboard</h3>
        <Col md={12}>
          <LoginButtons />
        </Col>
      </Row>
    )
  }
}

export default Login;
