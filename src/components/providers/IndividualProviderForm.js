import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import { fetchProvider, fetchProviders, createProvider, updateProvider, deleteProvider } from '../../store/actions/providerActions.js'

class IndividualProviderForm extends Component {
  constructor(props) {
    super(props);
    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
    this.state= { form : {
      provider_type: 'Individual',
      id: '',
      first_name: '',
      last_name: '',
      gender: '',
      email: '',
      phone: '',
      phone_extension: '',
      referrer: '',
      location: '',
      visibility: 'select'
      }
    } 
  }

  formValChange(e) {
    let next = {...this.state.form, [e.target.id] : e.target.value};
    this.setState({ form : next });
  }

  submit(e) {
    e.preventDefault();
    this.props.dispatch(createProvider(this.state.form));
    this.props.history.push('/providers/new/add-service');
  }

  render() {
  const isEnabled = 
    this.state.form.phone.length > 0 &&
    this.state.form.email.length > 0 &&
    this.state.form.first_name.length > 0 &&
    this.state.form.last_name.length > 0 && 
    this.state.form.location.length > 0 &&
    this.state.form.visibility !== 'select';

	return (
	  <Row className="content">
	    <Col sm={12}>
	      <h3>New Provider Profile</h3>
	      <hr/>
	    </Col>

	    <Col sm={12}>
	      <Form horizontal>
          <FormGroup controlId="first_name">
            <Col componentClass={ControlLabel} sm={3}>
              First name (required)
            </Col>
            <Col sm={9}>
              <FormControl type="text"
                placeholder="First name" defaultValue="" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="last_name">
            <Col componentClass={ControlLabel} sm={3}>
              Last name (required)
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="Last name" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="preferred_name">
            <Col componentClass={ControlLabel} sm={3}>
              Preferred Name
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="gender">
            <Col componentClass={ControlLabel} sm={3}>
              Gender
            </Col>
            <Col sm={9}>
              <FormControl componentClass="select" placeholder="select" onChange={this.formValChange}>
                <option value="select">-- Not Set --</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </FormControl>
            </Col>
          </FormGroup>


          <FormGroup controlId="email">
            <Col componentClass={ControlLabel} sm={3}>
              Email
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="youremail@gmail.com" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="phone">
            <Col componentClass={ControlLabel} sm={3}>
              Phone Number (required)
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="extension">
            <Col componentClass={ControlLabel} sm={3}>
              Extension
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId= "location">
            <Col componentClass={ControlLabel} sm={3}>
              Address
            </Col>
            <Col sm={9}>
              <FormControl type="text" value={this.state.location} onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="referrer">
            <Col componentClass={ControlLabel} sm={3}>
              Referrer
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
export default connect()(withRouter(IndividualProviderForm));
