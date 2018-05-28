import React, { Component } from 'react';
import { withRouter } from 'react-router';

// redux
import { connect } from 'react-redux'
import { createClient } from '../../store/actions/clientActions.js'

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

class ClientForm extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      form: { 
        first_name: '',
        last_name: '',
        preferred_name: '',
        gender: '',
        birth_date: '',
        email: '',
        mobile_phone: '',
        home_phone: '',
        address: '',
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  formValChange(e) {
    let nextForm = {...this.state.form, [e.target.id]: e.target.value};
    this.setState({ form: nextForm });    
  }

  submit() {
    this.props.dispatch(createClient(this.state.form));
    this.props.history.push('/clients')
  }

  render() {
    return (
      <Row className="content">
        <Col sm={12}>
          <h3>New Named Client Profile</h3>
          <hr />
        </Col>
        <Col sm={12}>
          <Form horizontal>
            <FormGroup controlId="first_name">
              <Col componentClass={ControlLabel} sm={3}>
                First name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" placeholder="Aravind" value={this.state.first_name} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name (required)
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.last_name}
                  placeholder="Adiga"
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="preferred_name">
              <Col componentClass={ControlLabel} sm={3}>
                Preferred Name
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.preferred_name} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="gender">
              <Col componentClass={ControlLabel} sm={3}>
                Gender
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select" value={this.state.gender} onChange={this.formValChange}>
                  <option value="select">-- Not Set --</option>
                  <option value="0">Female</option>
                  <option value="1">Male</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="birth_date">
              <Col componentClass={ControlLabel} sm={3}>
                Date of Birth
              </Col>
              <Col sm={9}>
                <FormControl type="date" value={this.state.birth_date} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.email}
                  placeholder="aravind.adiga.gmail.com"
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="mobile_phone">
              <Col componentClass={ControlLabel} sm={3}>
                Cell Phone
              </Col>
              <Col sm={9}>
                <FormControl type="tel" value={this.state.mobile_phone} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="home_phone">
              <Col componentClass={ControlLabel} sm={3}>
                Home Phone (required)
              </Col>
              <Col sm={9}>
                <FormControl type="tel" value={this.state.home_phone} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="address">
              <Col componentClass={ControlLabel} sm={3}>
                Address
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.address} onChange={this.formValChange} />
              </Col>
            </FormGroup>

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

export default connect()(withRouter(ClientForm));
