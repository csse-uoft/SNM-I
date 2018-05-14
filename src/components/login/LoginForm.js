import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import { FormGroup, Form, Col, FormControl, Button, HelpBlock } from 'react-bootstrap';

class LoginForm extends Component {
  render() {
    return (
      <Form horizontal>
        <FormGroup controlId="formHorizontalEmail">
          <Col sm={12}>
            <FormControl type="email" placeholder="Email" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalPassword">
          <Col sm={12}>
            <FormControl type="password" placeholder="Password" />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={12}>
            <Link to={`/dashboard`}>
              <Button type="submit">Sign in</Button>
            </Link>
          </Col>
          <HelpBlock className="forgot-password">
            Forgot password?
          </HelpBlock>
        </FormGroup>
      </Form>
    )
  }
}

export default LoginForm;
