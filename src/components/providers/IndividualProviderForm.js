import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Checkbox } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'

import { createProvider, updateProvider } from '../../store/actions/providerActions.js'
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';


class IndividualProviderForm extends Component {
  constructor(props) {
    super(props);
    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
    this.mainAddressChange = this.mainAddressChange.bind(this);
    this.operationHourChange = this.operationHourChange.bind(this);
    this.languagesChange = this.languagesChange.bind(this);
    this.cateogiresIntoCheckboxes = this.cateogiresIntoCheckboxes.bind(this);
    this.otherAddressChange = this.otherAddressChange.bind(this);
    const id = this.props.match.params.id;
    let provider = {};
    let availability = [
      {week_day: 'Mon', start_time: "", end_time: ""},
      {week_day: 'Tues', start_time: "", end_time: ""},
      {week_day: 'Weds', start_time: "", end_time: ""},
      {week_day: 'Thurs', start_time: "", end_time: ""},
      {week_day: 'Fri', start_time: "", end_time: ""},
      {week_day: 'Sat', start_time: "", end_time: ""},
      {week_day: 'Sun', start_time: "", end_time: ""}
    ]
    if (id) {
      provider = this.props.providersById[id];
      const days_index = {'Mon': 0, 'Tues': 1, 'Weds': 2, 'Thurs': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6};
      const operation_hour_list = provider.operation_hours;
      operation_hour_list.forEach(op_hour => {
        const index = days_index[op_hour.week_day];
        availability[index].start_time = op_hour.start_time;
        availability[index].end_time = op_hour.end_time;
      });
    }

    this.state = {
      providerId: provider.id,
      mode: (provider.id) ? 'edit' : 'new',
      form : {
        provider_type: 'Individual',
        provider_category: provider.provider_category || '',
        id: id,
        languages: provider.languages || [],
        first_name: provider.first_name,
        last_name: provider.last_name,
        gender: provider.gender,
        email: provider.email,
        primary_phone_number: provider.primary_phone_number || '',
        primary_phone_extension: provider.primary_phone_extension || '',
        alt_phone_number: provider.alt_phone_number || '',
        alt_phone_extension: provider.alt_phone_extension || '',
        sec_contact_first_name: provider.sec_contact_first_name || '',
        sec_contact_last_name:provider.sec_contact_last_name || '',
        sec_contact_email: provider.sec_contact_email || '',
        sec_contact_primary_phone_number: provider.sec_contact_primary_phone_number || '',
        sec_contact_primary_phone_extension: provider.sec_contact_primary_phone_extension || '',
        sec_contact_alt_phone_number: provider.sec_contact_alt_phone_number || '',
        sec_contact_alt_phone_extension: provider.sec_contact_primary_phone_extension || '',
        main_address: Object.assign({
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
        }, provider.main_address),
        other_addresses: [{
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
        }],
        operation_hours: availability,
        referrer: provider.referrer || '',
        own_car: provider.own_car || '',
        visibility: provider.visibility,
        status: provider.status,
        notes: provider.notes || ''
      }
    } 
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('languages'));
  }

  formValChange(e) {
    let next = {...this.state.form, [e.target.id] : e.target.value};
    this.setState({ form : next });
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
  }

  submit(e) {
    e.preventDefault();
    if (this.state.mode === 'edit') {
      const id = this.props.match.params.id
      this.props.dispatch(updateProvider(this.state.form.id, this.state.form));
      this.props.history.push('/provider/' + id);
    } else {
      this.props.dispatch(createProvider(this.state.form));
      this.props.history.push('/providers/new/add-service');
    }
  }

  mainAddressChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['main_address'][e.target.id] = e.target.value;
    this.setState({ form: nextForm });
  }

  otherAddressChange(e) {
    let nextForm = _.clone(this.state.form);
    const address_index = e.target.id.split('-')[0];
    const address_field = e.target.id.split('-')[1];
    nextForm['other_addresses'][address_index][address_field] = e.target.value;
    this.setState({ form: nextForm });
  }

  languagesChange(e) {
    let nextForm = _.clone(this.state.form);
    if (e.target.checked) {
      nextForm['languages'].push(e.target.value)
    } else {
      _.remove(nextForm['languages'], (language) => {
        return language === e.target.value
      });
    }
    console.log(nextForm.languages)
    this.setState({form: nextForm});
  }

  cateogiresIntoCheckboxes(categories, checkedCategories) {
    let updatedCategories = _.clone(categories)
    return updatedCategories.map((category) => {
      return (
        <Checkbox
          key={category}
          value={category}
          checked={_.includes(checkedCategories, category)}
          onChange={this.languagesChange}
          inline
        >
        {category}
        </Checkbox>
      )
    })
  }

  render() {
    const isEnabled =
      this.state.form.primary_phone_number.length > 0 &&
      this.state.form.email.length > 0 &&
      this.state.form.first_name.length > 0 &&
      this.state.form.last_name.length > 0 &&
      this.state.form.main_address.postal_code.length === 6 &&
      this.state.form.visibility !== 'select';

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{(this.state.mode === 'edit') ? 'Edit Provider Profile' : 'New Provider Profile'}</h3>
          <hr/>
        </Col>
        <Col sm={12}>
          <Form horizontal>
            <FormGroup controlId="provider_category">
              <Col componentClass={ControlLabel} sm={3}>
                Provider category *
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.provider_category}
                  onChange={this.formValChange}
                >
                  <option value="">--- Not Set ---</option>
                  <option value="Volunteer/Goods Donor">Volunteer/Goods Donor</option>
                  <option value="Professional Service Provider">Professional Service Provider</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="first_name">
              <Col componentClass={ControlLabel} sm={3}>
                First name *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder="First name"
                  value={this.state.form.first_name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder="Last name"
                  value={this.state.form.last_name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="preferred_name">
              <Col componentClass={ControlLabel} sm={3}>
                Preferred Name
              </Col>
              <Col sm={9}>
                <FormControl
                type="text"
                value={this.state.form.preferred_name}
                onChange={this.formValChange}
              />
              </Col>
            </FormGroup>

            <FormGroup controlId="gender">
              <Col componentClass={ControlLabel} sm={3}>
                Gender *
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.gender}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Other">Other</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.email}
                  placeholder="youremail@gmail.com"
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="primary_phone_number">
              <Col componentClass={ControlLabel} sm={3}>
                Telephone *
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
                <FormControl
                  type="text"
                  value={this.state.form.primary_phone_extension}
                  onChange={this.formValChange}
                />
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
                <FormControl
                  type="text"
                  value={this.state.form.alt_phone_extension}
                  onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="street_address">
              <Col componentClass={ControlLabel} sm={3}>
                Street Address *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.main_address.street_address}
                  onChange={this.mainAddressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="apt_number">
              <Col componentClass={ControlLabel} sm={3}>
                Apt. #
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.main_address.apt_number}
                  onChange={this.mainAddressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="city">
              <Col componentClass={ControlLabel} sm={3}>
                City *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.main_address.city}
                  onChange={this.mainAddressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="province">
              <Col componentClass={ControlLabel} sm={3}>
                Province *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.main_address.province}
                  onChange={this.mainAddressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="postal_code">
              <Col componentClass={ControlLabel} sm={3}>
                Postal Code *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.main_address.postal_code}
                  onChange={this.mainAddressChange}
                />
              </Col>
            </FormGroup>
            <hr/>
            <h3> Alternate Address </h3>
            <FormGroup controlId="0-street_address">
              <Col componentClass={ControlLabel} sm={3}>
                Street Address
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.other_addresses[0].street_address}
                  onChange={this.otherAddressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="0-apt_number">
              <Col componentClass={ControlLabel} sm={3}>
                Apt. #
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.other_addresses[0].apt_number}
                  onChange={this.otherAddressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="0-city">
              <Col componentClass={ControlLabel} sm={3}>
                City
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.other_addresses[0].city}
                  onChange={this.otherAddressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="0-province">
              <Col componentClass={ControlLabel} sm={3}>
                Province
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.other_addresses[0].province}
                  onChange={this.otherAddressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="0-postal_code">
              <Col componentClass={ControlLabel} sm={3}>
                Postal Code
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.other_addresses[0].postal_code}
                  onChange={this.otherAddressChange}
                />
              </Col>
            </FormGroup>
            <hr/>

            <FormGroup controlId="languages">
              <Col componentClass={ControlLabel} sm={3}>
                Languages
              </Col>
              <Col sm={9}>
                {this.props.categoriesLoaded &&
                  this.cateogiresIntoCheckboxes(
                    this.props.languagesCategories,
                    this.state.form.languages
                  )
                }
              </Col>
            </FormGroup>

            <FormGroup controlId="referrer">
              <Col componentClass={ControlLabel} sm={3}>
                Referrer
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.referrer}
                  onChange={this.formValChange}/>
              </Col>
            </FormGroup>
            <hr/>
            <h4> Availability </h4>
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
            {this.state.form.provider_category === "Volunteer/Goods Donor" &&
              <FormGroup controlId="own_car">
                <Col componentClass={ControlLabel} sm={3}>
                  Own a car
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    value={this.state.form.own_car}
                    onChange={this.formValChange}
                  >
                    <option value="">--- Not Set ---</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </FormControl>
                </Col>
              </FormGroup>
            }

            <FormGroup controlId="status">
              <Col componentClass={ControlLabel} sm={3}>
                Status *
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
                Allow other agencies to see this provider? *
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.visibility}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId="notes">
              <Col componentClass={ControlLabel} sm={3}>
                Additional notes
              </Col>
              <Col sm={9}>
                <FormControl
                  type="textarea"
                  value={this.state.form.notes}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button
                  disabled={!isEnabled}
                  type="submit"
                  onClick={this.submit}
                >
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
    providersById: state.providers.byId || {},
    providerLoaded: state.providers.indexLoaded,
    languagesCategories: state.ontology.languages.categories,
    categoriesLoaded: state.ontology.languages.loaded
  }
}
export default connect(mapStateToProps)(withRouter(IndividualProviderForm));
