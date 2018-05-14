import React, { Component } from 'react'

import { Row, Col } from 'react-bootstrap';

// components
import LoginForm from './login/LoginForm.js';
import LoginButtons from './login/LoginButtons.js';

// styles
import '../stylesheets/Login.css';


class Login extends Component {
  render() {
    return(
      <Row className='content login-pane'>
        <h3>Log in to your Dashboard</h3>
        <Col md={12}>
          <LoginButtons />
        </Col>
      </Row>
    )
  }
}

export default Login;
