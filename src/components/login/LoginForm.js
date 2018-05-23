import React, { Component } from 'react'
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { login } from '../../store/actions/authAction';
import { FormGroup, Form, Col, FormControl, Button, HelpBlock } from 'react-bootstrap';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      form: {
        username: '',
        password: ''
      } 
    }

    this.submit = this.submit.bind(this);
    this.formValChange = this.formValChange.bind(this);
  }

  submit() {
    this.props.dispatch(login(this.state.form));
  }

  formValChange(e) {
    let nextForm = {...this.state.form, [e.target.id]: e.target.value};
    this.setState({ form: nextForm });    
  }
  
  render() {

    return (
      <Form horizontal>
        <FormGroup controlId="username">
          <Col sm={12}>
            <FormControl type="text" placeholder="username" value={this.state.form.username} onChange={this.formValChange} />
          </Col>
        </FormGroup>

        <FormGroup controlId="password">
          <Col sm={12}>
            <FormControl type="password" placeholder="Password" value={this.state.form.password} onChange={this.formValChange} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={12}>
            <Link to="/dashboard">
              <Button type="submit" onClick={this.submit}>
                Sign in
              </Button>
            </Link>
          </Col>
          <HelpBlock className="forgot-password">
            Forgot password?
          </HelpBlock>
        </FormGroup>
      </Form>
    );
  }
}

export default connect()(LoginForm); 
