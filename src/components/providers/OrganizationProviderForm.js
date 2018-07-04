import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { createProvider } from '../../store/actions/providerActions.js'
import { withRouter } from 'react-router';
import { connect } from 'react-redux'

import { emailValidation } from '../../helpers/validation_helpers.js'


class OrganizationProviderForm extends Component {
  constructor(props) {
    super(props);
    const provider = {}
    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
    this.addressChange = this.addressChange.bind(this);
    this.operationHourChange = this.operationHourChange.bind(this);

    //this.addressValChange = this.addressValChange.bind(this);
    //this.addressSelected = this.addressSelected.bind(this);
    this.state= { form : {
      provider_type: 'Organization',
      id: '',
      company: '',
      first_name: '',
      last_name: '',
      gender: 'Other',
      email: '',
      primary_phone_number: '',
      primary_phone_extension: '',
      alt_phone_number: '',
      alt_phone_extension: '',
      sec_contact_first_name: '',
      sec_contact_last_name:'',
      sec_contact_email: '',
      sec_contact_primary_phone_number: '',
      sec_contact_primary_phone_extension: '',
      sec_contact_alt_phone_number: '',
      sec_contact_alt_phone_extension: '',
      address: Object.assign({
        street_address: '',
        apt_number: '',
        city: '',
        province: '',
        postal_code: ''
      }, provider.address),
      lng_lat: "",
      operation_hours: [{week_day: 'Mon', start_time: '', end_time: ''},
                        {week_day: 'Tues', start_time: '', end_time: ''},
                        {week_day: 'Weds', start_time: '', end_time: ''},
                        {week_day: 'Thurs', start_time: '', end_time: ''},
                        {week_day: 'Fri', start_time: '', end_time: ''},
                        {week_day: 'Sat', start_time: '', end_time: ''},
                        {week_day: 'Sun', start_time: '', end_time: ''}
                        ],
      visibility: 'select',
      status: (props.location.state && props.location.state.status) || ''
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

  operationHourChange(e) {
    let dayIndex = {
      mon_operation_hours: 0,
      tues_operation_hours: 1,
      wed_operation_hours: 2,
      thurs_operation_hours: 3,
      fri_operation_hours: 4,
      sat_operation_hours: 5,
      sun_operation_hours: 6
    }
    let nextForm = _.clone(this.state.form);
    let dayTime = e.target.id.split('-');
    let day = dayIndex[dayTime[0]];
    nextForm['operation_hours'][day][dayTime[1]] = e.target.value;
    this.setState({ form: nextForm });
    console.log(nextForm);
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
          <h4> Company Operation Hours </h4>
          <hr/>
          <Form inline>
            <h4> Monday </h4>
            <FormGroup controlId="mon_operation_hours-start_time">
              <Col componentClass={ControlLabel} sm={3}>
                Start Time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.operation_hours[0].start_time}
                  placeholder=""
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="mon_operation_hours-end_time">
              <Col componentClass={ControlLabel} sm={3}>
                End time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.operation_hours[0].end_time}
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>
          </Form>

          <Form inline>
            <h4> Tuesday </h4>
            <FormGroup controlId="tues_operation_hours-start_time">
              <Col componentClass={ControlLabel} sm={3}>
                Start Time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.operation_hours[1].start_time}
                  placeholder=""
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="tues_operation_hours-end_time">
              <Col componentClass={ControlLabel} sm={3}>
                End time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.operation_hours[1].end_time}
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>
          </Form>

          <Form inline>
            <h4> Wednesday </h4>
            <FormGroup controlId="weds_operation_hours-start_time">
              <Col componentClass={ControlLabel} sm={3}>
                Start Time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.operation_hours[2].start_time}
                  placeholder=""
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="weds_operation_hours-end_time">
              <Col componentClass={ControlLabel} sm={3}>
                End time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.operation_hours[2].end_time}
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>
          </Form>

          <Form inline>
            <h4> Thursday </h4>
            <FormGroup controlId="thurs_operation_hours-start_time">
              <Col componentClass={ControlLabel} sm={3}>
                Start Time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.operation_hours[3].start_time}
                  placeholder=""
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="thurs_operation_hours-end_time">
              <Col componentClass={ControlLabel} sm={3}>
                End time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.operation_hours[3].end_time}
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>
          </Form>

          <Form inline>
            <h4> Friday </h4>
            <FormGroup controlId="fri_operation_hours-start_time">
              <Col componentClass={ControlLabel} sm={3}>
                Start Time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.operation_hours[4].start_time}
                  placeholder=""
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="fri_operation_hours-end_time">
              <Col componentClass={ControlLabel} sm={3}>
                End time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.operation_hours[4].end_time}
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>
          </Form>

          <Form inline>
            <h4> Saturday </h4>
            <FormGroup controlId="sat_operation_hours-start_time">
              <Col componentClass={ControlLabel} sm={3}>
                Start Time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.operation_hours[5].start_time}
                  placeholder=""
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="sat_operation_hours-end_time">
              <Col componentClass={ControlLabel} sm={3}>
                End time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.operation_hours[5].end_time}
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>
          </Form>

          <Form inline>
            <h4> Sunday </h4>
            <FormGroup controlId="sun_operation_hours-start_time">
              <Col componentClass={ControlLabel} sm={3}>
                Start Time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.operation_hours[6].start_time}
                  placeholder=""
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="sun_operation_hours-end_time">
              <Col componentClass={ControlLabel} sm={3}>
                End time
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.operation_hours[6].end_time}
                  onChange={this.operationHourChange}
                />
              </Col>
            </FormGroup>
          </Form>

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

          <FormGroup controlId="email" validationState={emailValidation(this.state.form.email)}>
            <Col componentClass={ControlLabel} sm={3}> 
              Email (required) 
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="youremail@gmail.com" onChange={this.formValChange}/>
              <FormControl.Feedback />
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

          <hr/>
          <h4> Secondary Contact Information </h4>
          <hr/>

          <FormGroup controlId="sec_contact_first_name">
            <Col componentClass={ControlLabel} sm={3}>
              Secondary Contact Person First Name
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="First name" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="sec_contact_last_name">
            <Col componentClass={ControlLabel} sm={3}>
              Secondary Contact Person Last Name
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="Last name" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="sec_contact_email" validationState={emailValidation(this.state.form.email)}>
            <Col componentClass={ControlLabel} sm={3}>
              Email
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue=""
                placeholder="youremail@gmail.com" onChange={this.formValChange}/>
              <FormControl.Feedback />
            </Col>
          </FormGroup>

          <FormGroup controlId="sec_contact_primary_phone_number">
            <Col componentClass={ControlLabel} sm={3}>
              Telephone
            </Col>
            <Col sm={9}>
              <FormControl
                type="tel"
                value={this.state.form.sec_contact_primary_phone_number}
                onChange={this.formValChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="sec_contact_primary_phone_extension">
            <Col componentClass={ControlLabel} sm={3}>
              Extension
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="sec_contact_alt_phone_number">
            <Col componentClass={ControlLabel} sm={3}>
              Alternative Phone Number
            </Col>
            <Col sm={9}>
              <FormControl
                type="tel"
                value={this.state.form.sec_contact_alt_phone_number}
                onChange={this.formValChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="sec_contact_alt_phone_extension">
            <Col componentClass={ControlLabel} sm={3}>
              Extension for Alternative Phone Number
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" onChange={this.formValChange}/>
            </Col>
          </FormGroup>

          <hr/>

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
                disabled={this.state.form.status === "Home Agency"}
              >
                <option value="select">--- Not Set ---</option>
                <option value="External">External</option>
                <option value="Internal">Internal</option>
                { this.state.form.status === "Home Agency" ? (
                  <option value="Home Agency">Home Agency</option>
                ): null }
              </FormControl>
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
