import React, { Component } from 'react';
import { withRouter } from 'react-router';
import GeneralField from '../shared/GeneralField';

// redux
import { connect } from 'react-redux'
import { createUser, updateUser } from '../../store/actions/userActions.js'

import { Button, Form, FormGroup, ControlLabel, Col, Row, Radio } from 'react-bootstrap';

class UserForm extends Component {
  constructor(props) {
    super(props);
    let user = {};
    if (this.props.match.params.id) {
      user = this.props.usersById[this.props.match.params.id]
    }

    this.state = {
      userId: user.id,
      mode: (user.id) ? 'edit' : 'new',
      form: {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        is_superuser: user.is_superuser || false,
        primary_phone_number: user.primary_phone_number || '',
        alt_phone_number: user.alt_phone_number || '',
        password: ''
      },
      errors: {}
    }

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  formValChange(e, id=e.target.id) {
    let nextForm = {...this.state.form, [id]: e.target.value};
    this.setState({ form: nextForm });
  }

  submit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      if (this.state.mode === 'edit') {
        let form = Object.assign({}, this.state.form);
        delete form['password']
        this.props.dispatch(updateUser(this.state.userId, form));
        this.props.history.push('/users')
        this.forceUpdate()
      } 
      else {
        this.props.dispatch(createUser(this.state.form));
        this.props.history.push('/users')
        this.forceUpdate()
      }
    }
    

  }

    validateForm() {

      let errors = {};
      let formIsValid = true;

      if (!this.state.form.first_name) {
        formIsValid = false;
        errors["firstname"] = "*Please enter the first name.";
      }

      if (typeof this.state.form.first_name !== "undefined") {
        if (!this.state.form.first_name.match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
          errors["firstname"] = "*Please enter alphabet characters only.";
        }
      }

      if (!this.state.form.last_name) {
        formIsValid = false;
        errors["lastname"] = "*Please enter the last name.";
      }

      if (typeof this.state.form.last_name !== "undefined") {
        if (!this.state.form.last_name.match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
          errors["lastname"] = "*Please enter alphabet characters only.";
        }
      }

      if (!this.state.form.username) {
        formIsValid = false;
        errors["username"] = "*Please enter your username.";
      }

      if (typeof this.state.form.username !== "undefined") {
        if (!this.state.form.username.match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
          errors["username"] = "*Please enter alphabet characters only.";
        }
      }

      if (!this.state.form.email) {
        formIsValid = false;
        errors["email"] = "*Please enter your email.";
      }

      if (typeof this.state.form.email !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(this.state.form.email)) {
          formIsValid = false;
          errors["email"] = "*Please enter valid email.";
        }
      }

      if (!this.state.form.primary_phone_number) {
        formIsValid = false;
        errors["phone"] = "*Please enter your phone number.";
      }

      if (typeof this.state.form.primary_phone_number !== "undefined") {
        if (!this.state.form.primary_phone_number.match(/^[0-9]{10}$/)) {
          formIsValid = false;
          errors["phone"] = "*Please enter valid phone number.";
        }
      }

      if (this.state.form.alt_phone_number !== "") {
        if (!this.state.form.alt_phone_number.match(/^[0-9]{10}$/)) {
          formIsValid = false;
          errors["altphone"] = "*Please enter valid phone number.";
        }
      }

      if (!this.state.form.password) {
        formIsValid = false;
        errors["password"] = "*Please enter your password.";
      }

      if (typeof this.state.form.password !== "undefined") {
        if (!this.state.form.password.match(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/)) {
          formIsValid = false;
          errors["password"] = "*Please enter secure and strong password.";
        }
      }

      this.setState({
        errors: errors
      });
      return formIsValid;

    }

  render() {
    const formTitle = (this.state.mode === 'edit') ? 'Edit User' : 'Create User'
    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{formTitle}</h3>
          <hr />
        </Col>
        <Col sm={12}>
          <Form horizontal>
            <FormGroup controlId="is_superuser">
              <Col componentClass={ControlLabel} sm={3}>
                Admin?
              </Col>
              <Col sm={9}>
                <Radio
                  name="radioGroup"
                  value="1"
                  onChange={e => this.formValChange(e, 'is_superuser')}
                  defaultChecked={this.state.form.is_superuser === true}
                  inline
                >
                  Yes
                </Radio>{' '}
                <Radio
                  name="radioGroup"
                  value="0"
                  onChange={e => this.formValChange(e, 'is_superuser')}
                  defaultChecked={this.state.form.is_superuser === false}
                  inline
                >
                  No
                </Radio>{' '}
              </Col>
            </FormGroup>
            <GeneralField
              id="first_name"
              label="First name"
              type="text"
              value={this.state.form.first_name}
              onChange={this.formValChange}
              required
            /><div className="errorMsg">{this.state.errors.firstname}</div>
            <GeneralField
              id="last_name"
              label="Last name"
              type="text"
              value={this.state.form.last_name}
              onChange={this.formValChange}
              required
            /><div className="errorMsg">{this.state.errors.lastname}</div>
            <GeneralField
              id="username"
              label="Username"
              type="text"
              value={this.state.form.username}
              onChange={this.formValChange}
              required
            /><div className="errorMsg">{this.state.errors.username}</div>
            <GeneralField
              id="email"
              label="Email"
              type="email"
              value={this.state.form.email}
              onChange={this.formValChange}
              required
            /><div className="errorMsg">{this.state.errors.email}</div>
            
              <GeneralField
                id="password"
                label="Password"
                type="password"
                value={this.state.form.password}
                onChange={this.formValChange}
                required
              /><div className="errorMsg">{this.state.errors.password}</div>
            
            <GeneralField
              id="primary_phone_number"
              label="Telephone"
              type="tel"
              value={this.state.form.primary_phone_number}
              onChange={this.formValChange}
              required
            /><div className="errorMsg">{this.state.errors.phone}</div>
            <GeneralField
              id="alt_phone_number"
              label="Alternative Phone Number"
              type="tel"
              value={this.state.form.alt_phone_number}
              onChange={this.formValChange}
            /><div className="errorMsg">{this.state.errors.altphone}</div>
            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button onClick={this.submit}>
                  Submit
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    usersById: state.users.byId
  }
}

export default connect(mapStateToProps)(withRouter(UserForm));
