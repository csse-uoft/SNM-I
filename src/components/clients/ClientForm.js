import React, { Component } from 'react';
import { withRouter } from 'react-router';

// redux
import { connect } from 'react-redux'
import { createClient, updateClient } from '../../store/actions/clientActions.js'

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

class ClientForm extends Component {
  constructor(props) {
    super(props);
    let client = {};
    if (this.props.match.params.id) {
      client = this.props.clientsById[this.props.match.params.id]
    }

    this.state = {
      clientId: client.id,
      mode: (client.id) ? 'edit' : 'new',
      form: {
        first_name: client.first_name || '',
        last_name: client.last_name || '',
        preferred_name: client.preferred_name || '',
        gender: (client.gender !== undefined) ? client.gender.toString() : '',
        birth_date: client.birth_date || '',
        email: client.email || '',
        mobile_phone: (client.phone_numbers && client.phone_numbers.length > 0) ?
          getPhoneNumber(client.phone_numbers, 'mobile') : '',
        home_phone: (client.phone_numbers && client.phone_numbers.length > 0) ?
          getPhoneNumber(client.phone_numbers, 'home') : '',
        address: (client.locations && client.locations.length > 0) ?
          client.locations[0].properties.address : '',
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
    if (this.state.mode === 'edit') {
      let form = Object.assign({}, this.state.form);
      this.props.dispatch(updateClient(this.state.clientId, form));
    } else {
      this.props.dispatch(createClient(this.state.form));
    }
    this.props.history.push('/clients')
  }

  render() {
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Client Profile' : 'New Named Client Profile'
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
                First name (required)
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder="Aravind"
                  value={this.state.form.first_name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name (required)
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.last_name}
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
                <FormControl type="text" value={this.state.form.preferred_name} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="gender">
              <Col componentClass={ControlLabel} sm={3}>
                Gender
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.gender}
                  onChange={this.formValChange}
                >

                  <option value="select">--- Not Set ---</option>
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
                <FormControl
                  type="date"
                  value={this.state.form.birth_date}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.email}
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
                <FormControl
                  type="tel"
                  value={this.state.form.mobile_phone}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="home_phone">
              <Col componentClass={ControlLabel} sm={3}>
                Home Phone (required)
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  value={this.state.form.home_phone}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="address">
              <Col componentClass={ControlLabel} sm={3}>
                Address
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.address}
                  onChange={this.formValChange}
                />
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

const mapStateToProps = (state) => {
  return {
    clientsById: state.clients.byId
  }
}

function getPhoneNumber(phoneNumbers, phoneType) {
  let matchedNumber = null
  phoneNumbers.forEach(function(phoneNumber) {
    if (phoneNumber.phone_type == phoneType) {
      matchedNumber = phoneNumber.phone_number
    }
  });
  return matchedNumber
}

export default connect(mapStateToProps)(withRouter(ClientForm));
