import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';
import { Link } from 'react-router-dom';
import { fetchProviders, createProvider, updateProvider, deleteProvider } from '../../store/actions/providerActions.js'
import { withRouter } from 'react-router';
import { connect } from 'react-redux'

class OrganizationProviderForm extends Component {
  constructor(props) {
    super(props);
    const provider = {}
    this.formValChange = this.formValChange.bind(this);
    this.submit=this.submit.bind(this);
    this.addressChange = this.addressChange.bind(this);
    this.state= { form : {
      provider_type: 'Organization',
      id: '',
      company: '',
      first_name: '',
      last_name: '',
      email: '',
      primary_phone_number: '',
      primary_phone_extension: '',
      alt_phone_number: '',
      alt_phone_extension: '',
      address: Object.assign({
        street_address: '',
        apt_number: '',
        city: '',
        province: '',
        postal_code: ''
      }, provider.address),
      visibility: 'select',
      status: ''
      }
    }
  }

  formValChange(e) {
    let next = {...this.state.form, [e.target.id] : e.target.value};
    this.setState({ form : next });
    }

  submit(e) {
    this.props.dispatch(createProvider(this.state.form));
    this.props.history.push('/providers/new/add-service');
  }

  addressChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['address'][e.target.id] = e.target.value
    this.setState({ form: nextForm });
  }

  render() {
    const isEnabled = 
      this.state.form.primary_phone_number.length > 0 &&
      this.state.form.email.length > 0 &&
      this.state.form.first_name.length > 0 &&
      this.state.form.last_name.length > 0 && 
      this.state.form.address.postal_code.length == 6 &&
      this.state.form.visibility !== 'select';

  return (
    <Row className="content">
      <Col sm={12}>
        <h3>New Provider Profile</h3>
        <hr/>
      </Col>

      <Col sm={12}>
        <Form horizontal>
          <FormGroup controlId="company">
            <Col componentClass={ControlLabel} sm={3}>
              Company/Organization Name
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="Company Name" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

<<<<<<< HEAD
          <FormGroup controlId="street_address">
            <Col componentClass={ControlLabel} sm={3}>
              Street Address
            </Col>
            <Col sm={9}>
              <FormControl
                type="text"
                value={this.state.form.address.street_address}
                onChange={this.addressChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="city">
            <Col componentClass={ControlLabel} sm={3}>
              City
            </Col>
            <Col sm={9}>
              <FormControl
                type="text"
                value={this.state.form.address.city}
                onChange={this.addressChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="province">
            <Col componentClass={ControlLabel} sm={3}>
              Province
            </Col>
            <Col sm={9}>
              <FormControl
                type="text"
                value={this.state.form.address.province}
                onChange={this.addressChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="postal_code">
=======
          <FormGroup controlId="status">
            <Col componentClass={ControlLabel} sm={3}>
              Status
            </Col>
            <Col sm={9}>
              <FormControl
                componentClass="select"
                placeholder="select"
                value={this.state.form.status}
                onChange={this.formValChange}
              >
                <option value="select">--- Not Set ---</option>
                <option value="External">External</option>
                <option value="Internal">Internal</option>
                <option value="Home Agency">Home Agency</option>
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="address">
>>>>>>> upstream/master
            <Col componentClass={ControlLabel} sm={3}>
              Postal Code
            </Col>
            <Col sm={9}>
              <FormControl
                type="text"
                value={this.state.form.address.postal_code}
                onChange={this.addressChange}
              />
            </Col>
          </FormGroup>

          <hr/>
          <h4> Contact Information </h4>
          <hr/>

          <FormGroup controlId="first_name">
            <Col componentClass={ControlLabel} sm={3}>
              Contact Person First Name
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="First name" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="last_name">
            <Col componentClass={ControlLabel} sm={3}>
              Contact Person Last Name
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="Last name" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="email">
            <Col componentClass={ControlLabel} sm={3}>
              Email (required)
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="youremail@gmail.com" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="primary_phone_number">
            <Col componentClass={ControlLabel} sm={3}>
              Telephone
            </Col>
            <Col sm={9}>
              <FormControl
                type="tel"
                value={this.state.form.primary_phone_number}
                onChange={this.formValChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="primary_phone_extension">
            <Col componentClass={ControlLabel} sm={3}>
              Extension
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="alt_phone_number">
            <Col componentClass={ControlLabel} sm={3}>
              Alternative Phone Number
            </Col>
            <Col sm={9}>
              <FormControl
                type="tel"
                value={this.state.form.alt_phone_number}
                onChange={this.formValChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="alt_phone_extension">
            <Col componentClass={ControlLabel} sm={3}>
              Extension for Alternative Phone Number
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="visibility">
            <Col componentClass={ControlLabel} sm={3}>
              Allow other agencies to see this provider?
            </Col>
            <Col sm={9}>
              <FormControl componentClass="select" placeholder="select" onChange={this.formValChange}>
                <option value="select">-- Not Set --</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={3} sm={9}>
              <Button disabled = {!isEnabled} type="submit" onClick={this.submit}>
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

export default connect()(withRouter(OrganizationProviderForm));
