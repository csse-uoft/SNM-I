import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';
import { Link } from 'react-router-dom';
import { fetchProviders, createProvider, updateProvider, deleteProvider } from '../../store/actions.js'
import { withRouter } from 'react-router';
import { connect } from 'react-redux'

class OrganizationProviderForm extends Component {
  constructor(props) {
    super(props);
    const provider = this.props.provider
    this.formValChange = this.formValChange.bind(this);
    this.submit=this.submit.bind(this);
    this.state= { form : {
      provider_type: 'Organization',
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      phone_extension: '',
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
      this.state.form.address.length > 0 &&
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

          <FormGroup controlId="address">
            <Col componentClass={ControlLabel} sm={3}>
              Location
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" onChange={this.formValChange} />
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

          <FormGroup controlId="phone">
            <Col componentClass={ControlLabel} sm={3}>
              Phone (required)
            </Col>
            <Col sm={9}>
              <FormControl type="tel" defaultValue="" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="phone_extension">
            <Col componentClass={ControlLabel} sm={3}>
              Extension
            </Col>
            <Col sm={9}>
              <FormControl type="tel" defaultValue="" onChange={this.formValChange}/>
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
              <Link to={`/providers/new/add-service`}>
                <Button disabled={false} type="submit" onClick={this.submit}>
                  Submit
                </Button>
              </Link>
            </Col>
          </FormGroup>
        </Form>
      </Col>
    </Row>
    );
  }
}

export default connect()(withRouter(OrganizationProviderForm));
