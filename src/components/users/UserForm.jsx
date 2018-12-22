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
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  formValChange(e, id=e.target.id) {
    let nextForm = {...this.state.form, [id]: e.target.value};
    this.setState({ form: nextForm });
  }

  submit() {
    if (this.state.mode === 'edit') {
      let form = Object.assign({}, this.state.form);
      delete form['password']
      this.props.dispatch(updateUser(this.state.userId, form));
    } else {
      this.props.dispatch(createUser(this.state.form));
    }
    this.props.history.push('/users')
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
            />
            <GeneralField
              id="last_name"
              label="Last name"
              type="text"
              value={this.state.form.last_name}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="username"
              label="Username"
              type="text"
              value={this.state.form.username}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="email"
              label="Email"
              type="email"
              value={this.state.form.email}
              onChange={this.formValChange}
              required
            />
            {(this.state.mode === 'new') &&
              <GeneralField
                id="password"
                label="Password"
                type="password"
                value={this.state.form.password}
                onChange={this.formValChange}
                required
              />
            }
            <GeneralField
              id="primary_phone_number"
              label="Telephone"
              type="tel"
              value={this.state.form.primary_phone_number}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="alt_phone_number"
              label="Alternative Phone Number"
              type="tel"
              value={this.state.form.alt_phone_number}
              onChange={this.formValChange}
            />
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
