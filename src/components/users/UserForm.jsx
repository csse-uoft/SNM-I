import React, { Component } from 'react';
import { withRouter } from 'react-router';

// redux
import { connect } from 'react-redux'
import { createUser, updateUser } from '../../store/actions/userActions.js'

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Radio } from 'react-bootstrap';

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
            <FormGroup controlId="first_name">
              <Col componentClass={ControlLabel} sm={3}>
                First name
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.first_name} onChange={ e => this.formValChange(e)} />
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.last_name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="username">
              <Col componentClass={ControlLabel} sm={3}>
                Username
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.username} onChange={ e => this.formValChange(e)} />
              </Col>
            </FormGroup>

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email
              </Col>
              <Col sm={9}>
                <FormControl type="email" value={this.state.form.email} onChange={ e => this.formValChange(e)} />
              </Col>
            </FormGroup>

            { (this.state.mode === 'new') ? (
              <FormGroup controlId="password">
                <Col componentClass={ControlLabel} sm={3}>
                  Password
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.password} onChange={ e => this.formValChange(e)} />
                </Col>
              </FormGroup>
            ) : null }

            <Row>
              <Col componentClass={ControlLabel} sm={3}>
                Admin?
              </Col>
              <Col sm={9}>
                <FormGroup controlId="is_superuser">
                  <Radio
                    name="radioGroup"
                    value='1'
                    onChange={ e => this.formValChange(e, 'is_superuser')}
                    defaultChecked={this.state.form.is_superuser === true}
                    inline
                  >
                    Yes
                  </Radio>{' '}
                  <Radio
                    name="radioGroup"
                    value='0'
                    onChange={ e => this.formValChange(e, 'is_superuser')}
                    defaultChecked={this.state.form.is_superuser === false}
                  inline>
                    No
                  </Radio>{' '}
                </FormGroup>
              </Col>
            </Row>


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
