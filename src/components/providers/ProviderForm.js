import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Checkbox, Well, ListGroup } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'

import { createProvider, updateProvider } from '../../store/actions/providerActions.js'
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { formatLocation } from '../../helpers/location_helpers'


class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.addressChange = this.addressChange.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.state = {
      address:{
        street_address: '',
        apt_number: '',
        city: '',
        province: '',
        postal_code: ''
      }
    }
  }

  submitClick() {
    this.props.submitAddress(this.state.address);
  }

  addressChange(e) {
    let nextAddress = _.clone(this.state.address);
    nextAddress[e.target.id] = e.target.value;
    this.setState({ address: nextAddress });
  }

  render() {
    return (
      <div>
      <Well>
        <FormGroup controlId="street_address">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            Street Address
          </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.address.street_address}
                  onChange={this.addressChange}
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
                  value={this.state.address.apt_number}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="city">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                City
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.address.city}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="province">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Province
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.address.province}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="postal_code">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Postal Code
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.address.postal_code}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>
            <Button onClick={this.submitClick}> Submit Address </Button>
        </Well>
      </div>
    )
  }
}

class AddressListItem extends Component {
  constructor(props) {
    super(props);
    this.removeAddress = this.removeAddress.bind(this);
  }

  removeAddress() {
    this.props.removeOtherAddress(this.props.addressIndex)
  }

  render() {
    return (
        <li className="list-group-item" key={this.props.address.postal_code}>
          <h4>
            {"Alternate Address " + (this.props.addressIndex + 1).toString()}
            <Button bsStyle='link' onClick={this.removeAddress}>Remove</Button>
          </h4>
          {formatLocation(this.props.address)}
        </li>
    )
  }
}

class ProviderForm extends Component {
  constructor(props) {
    super(props);
    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
    this.mainAddressChange = this.mainAddressChange.bind(this);
    this.operationHourChange = this.operationHourChange.bind(this);
    this.languagesChange = this.languagesChange.bind(this);
    this.categoriesIntoCheckboxes = this.categoriesIntoCheckboxes.bind(this);
    this.otherAddressChange = this.otherAddressChange.bind(this);
    this.toggleAddressButton = this.toggleAddressButton.bind(this);
    this.submitAddress = this.submitAddress.bind(this);
    this.removeOtherAddress = this.removeOtherAddress.bind(this);
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
      addressButtonClicked: false,
      form : {
        provider_type: provider.provider_type || '',
        provider_category: provider.provider_category || '',
        id: id,
        languages: provider.languages || [],
        company: provider.company || '',
        first_name: provider.first_name || '',
        last_name: provider.last_name || '',
        gender: provider.gender || '',
        email: provider.email || '',
        primary_phone_number: provider.primary_phone_number || '',
        primary_phone_extension: provider.primary_phone_extension || '',
        primary_phone_type: provider.primary_phone_type || '',
        alt_phone_number: provider.alt_phone_number || '',
        alt_phone_extension: provider.alt_phone_extension || '',
        alt_phone_type: provider.alt_phone_type || '',
        sec_contact_first_name: provider.sec_contact_first_name || '',
        sec_contact_last_name:provider.sec_contact_last_name || '',
        sec_contact_email: provider.sec_contact_email || '',
        sec_contact_primary_phone_number: provider.sec_contact_primary_phone_number || '',
        sec_contact_primary_phone_extension: provider.sec_contact_primary_phone_extension || '',
        sec_contact_alt_phone_number: provider.sec_contact_alt_phone_number || '',
        sec_contact_alt_phone_extension: provider.sec_contact_alt_phone_extension || '',
        main_address: Object.assign({
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
        }, provider.main_address),
        lng_lat: "",
        other_addresses: provider.other_addresses || [],
        operation_hours: availability,
        referrer: provider.referrer || '',
        own_car: provider.own_car || '',
        skills: provider.skills || '',
        visibility: provider.visibility,
        status: provider.status,
        notes: provider.notes || '',
        emergency_contact_name: provider.emergency_contact_name || '',
        emergency_contact_email: provider.emergency_contact_email || '',
        emergency_contact_phone: provider.emergency_contact_phone || '',
        emergency_contact_relationship: provider.emergency_contact_relationship || '',
        commitment: provider.commitment || '',
        start_date: provider.start_date || '',
        affiliation: provider.affiliation || '',
        education: provider.education || '',
        employment: provider.employment || '',
        mentoring: provider.mentoring || '',
        experience: provider.experience || '',
        interests: provider.interests || '',
        reason_for_volunteering: provider.reason_for_volunteering || '',
        reference1_name: provider.reference1_name || '',
        reference1_name: provider.reference1_phone || '',
        reference1_name: provider.reference1_email || '',
        reference2_name: provider.reference2_name || '',
        reference2_name: provider.reference2_phone || '',
        reference2_name: provider.reference2_email || ''
      }
    } 
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('languages'));
  }

  submitAddress(address) {
    let nextForm = _.clone(this.state.form);
    nextForm.other_addresses.push(address);
    this.setState({ form: nextForm, addressButtonClicked: false });
  }

  formValChange(e) {
    let next = {...this.state.form, [e.target.id] : e.target.value};
    this.setState({ form : next });
  }

  operationHourChange(e) {
    let dayIndex = {
      mon_operation_hours: 0,
      tues_operation_hours: 1,
      weds_operation_hours: 2,
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

  review(e) {
  }

  submit(e) {
    let form = Object.assign({}, this.state.form);
    if (this.state.mode === 'edit') {
      const id = this.props.match.params.id;
      this.props.dispatch(updateProvider(this.state.form.id, this.state.form))
        .then(() => this.props.history.push('/provider/' + id));
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
    this.setState({form: nextForm});
  }

  categoriesIntoCheckboxes(categories, checkedCategories) {
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

  toggleAddressButton() {
    this.setState({addressButtonClicked: !this.state.addressButtonClicked})
  }

  removeOtherAddress(index) {
    let nextForm = _.clone(this.state.form);
    nextForm['other_addresses'].splice(index, 1);
    this.setState({ form: nextForm });
  }

  render() {
    const isEnabled =
      this.state.form.primary_phone_number.length > 0 &&
      this.state.form.email.length > 0 &&
      this.state.form.first_name.length > 0 &&
      this.state.form.last_name.length > 0 &&
      this.state.form.visibility !== 'select';

    let addresses = this.state.form.other_addresses.map((address, index) =>
      <AddressListItem
        address={address}
        removeOtherAddress={this.removeOtherAddress}
        addressIndex={index}
      />
    )

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{(this.state.mode === 'edit') ? 'Edit Provider Profile' : 'New Provider Profile'}</h3>
          <hr/>
        </Col>
        <Col sm={12}>
          <Form horizontal>
          {this.state.mode === 'new' &&
            <FormGroup controlId="provider_type">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Select a provider type
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.provider_type}
                  onChange={this.formValChange}
                >
                  <option value="">Select</option>
                  <option value="Individual">Individual</option>
                  <option value="Organization">Organization</option>
                </FormControl>
              </Col>
            </FormGroup>
            }
            {this.state.form.provider_type === "Individual" &&
            <div>
            <FormGroup controlId="provider_category">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Provider category
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
            </div>
            }
            {this.state.form.provider_type === "Organization" &&
            <div>
              <FormGroup controlId="company">
                <Col className="required" componentClass={ControlLabel} sm={3}>
                  Company/Organization Name
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="text"
                    value={this.state.form.company}
                    placeholder="Company Name"
                    onChange={this.formValChange}/>
                </Col>
              </FormGroup>
            </div>
            }
            {this.state.form.provider_type &&
            <div>
            <hr/>
            <h4> Contact Information </h4>
            <hr/>
            <FormGroup controlId="first_name">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                {this.state.form.provider_type === "Individual" ?
                  "First name" : "Contact Person First Name"}
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
              <Col className="required" componentClass={ControlLabel} sm={3}>
                {this.state.form.provider_type === "Individual" ?
                  "Last name" : "Contact Person Last Name"}
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
            {this.state.form.provider_type === "Individual" &&
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
                    <option value="select">-- Not Set --</option>
                    <option value="Other">Other</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </FormControl>
                </Col>
              </FormGroup>
            }

            <FormGroup controlId="email">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Email
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
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Primary phone number
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

            <FormGroup controlId="primary_phone_type">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Primary phone type
              </Col>
              <Col sm={9}>
                <FormControl
                  type="select"
                  value={this.state.form.primary_phone_type}
                  onChange={this.formValChange}
                  componentClass="select"
                  placeholder="select"
                >
                  <option value="">--- Not Set ---</option>
                  <option value="Home">Home</option>
                  <option value="Cell">Cell</option>
                  <option value="Work">Work</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="alt_phone_number">
              <Col componentClass={ControlLabel} sm={3}>
                Alternative phone number
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
                Extension for Alternative phone number
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.alt_phone_extension}
                  onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="alt_phone_type">
              <Col componentClass={ControlLabel} sm={3}>
                Alternative phone type
              </Col>
              <Col sm={9}>
                <FormControl
                  type="select"
                  value={this.state.form.alt_phone_type}
                  onChange={this.formValChange}
                  componentClass="select"
                  placeholder="select"
                >
                  <option value="">--- Not Set ---</option>
                  <option value="Home">Home</option>
                  <option value="Cell">Cell</option>
                  <option value="Work">Work</option>
                </FormControl>
              </Col>
            </FormGroup>
            </div>
            }

            {this.state.form.provider_type === "Organization" &&
            <div>
              <hr/>
              <h4> Secondary Contact Information </h4>
              <hr/>
              <FormGroup controlId="sec_contact_first_name">
                <Col componentClass={ControlLabel} sm={3}>
                  Secondary Contact Person First Name
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.sec_contact_first_name}
                    placeholder="First name" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="sec_contact_last_name">
                <Col componentClass={ControlLabel} sm={3}>
                  Secondary Contact Person Last Name
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.sec_contact_last_name}
                    placeholder="Last name" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="sec_contact_email">
                <Col componentClass={ControlLabel} sm={3}>
                  Email
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.sec_contact_email}
                    placeholder="youremail@gmail.com" onChange={this.formValChange}/>
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
                  <FormControl
                    type="text"
                    value={this.state.form.sec_contact_primary_phone_extension}
                    onChange={this.formValChange}/>
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
                  <FormControl
                    type="text"
                    value={this.state.form.sec_contact_alt_phone_extension}
                    onChange={this.formValChange}/>
                </Col>
              </FormGroup>
            </div>
            }

            {this.state.form.provider_category === "Volunteer/Goods Donor" &&
            <div>
              <hr/>
              <h4> Emergency contact </h4>
              <hr/>
              <FormGroup controlId="emergency_contact_name">
                <Col componentClass={ControlLabel} sm={3}>
                  Name
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.emergency_contact_name}
                    placeholder="" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="emergency_contact_phone">
                <Col componentClass={ControlLabel} sm={3}>
                  Phone
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.emergency_contact_phone}
                    placeholder="" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="emergency_contact_email">
                <Col componentClass={ControlLabel} sm={3}>
                  Email
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.emergency_contact_email}
                    placeholder="" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="emergency_contact_relationship">
                <Col componentClass={ControlLabel} sm={3}>
                  Relationship
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="tel"
                    value={this.state.form.emergency_contact_relationship}
                    onChange={this.formValChange}
                  />
                </Col>
              </FormGroup>

            </div>
            }

            {this.state.form.provider_type &&
            <div>
            <hr/>
            <h4> Main Address </h4>
            <hr/>
            <FormGroup controlId="street_address">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Street Address
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
              <Col className="required" componentClass={ControlLabel} sm={3}>
                City
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
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Province
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
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Postal Code
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
            <h4>Alternate Addresses</h4>
            <ListGroup>
              {addresses}
            </ListGroup>
            <Button onClick={this.toggleAddressButton}>
              Add Alternate Address
            </Button>
            {this.state.addressButtonClicked &&
              <AddressForm
                addressIndex={this.state.form.other_addresses.length}
                addressChange={this.otherAddressChange}
                submitAddress={this.submitAddress}
              />
            }
            <hr/>

            <FormGroup controlId="languages">
              <Col componentClass={ControlLabel} sm={3}>
                Languages
              </Col>
              <Col sm={9}>
                {this.props.categoriesLoaded &&
                  this.categoriesIntoCheckboxes(
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

              <FormGroup controlId="mon_operation_hours-start_time">
                <Col componentClass={ControlLabel} sm={3}>
                  Period
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    value={this.state.form.operation_hours[0].start_time}
                    placeholder="select"
                    onChange={this.operationHourChange}
                  >
                    <option value="">--- Not Set ---</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </FormControl>
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

              <FormGroup controlId="tues_operation_hours-start_time">
                <Col componentClass={ControlLabel} sm={3}>
                  Period
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    value={this.state.form.operation_hours[1].start_time}
                    placeholder="select"
                    onChange={this.operationHourChange}
                  >
                    <option value="">--- Not Set ---</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </FormControl>
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
              <FormGroup controlId="weds_operation_hours-start_time">
                <Col componentClass={ControlLabel} sm={3}>
                  Period
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    value={this.state.form.operation_hours[2].start_time}
                    placeholder="select"
                    onChange={this.operationHourChange}
                  >
                    <option value="">--- Not Set ---</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </FormControl>
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
              <FormGroup controlId="thurs_operation_hours-start_time">
                <Col componentClass={ControlLabel} sm={3}>
                  Period
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    value={this.state.form.operation_hours[3].start_time}
                    placeholder="select"
                    onChange={this.operationHourChange}
                  >
                    <option value="">--- Not Set ---</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </FormControl>
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

              <FormGroup controlId="fri_operation_hours-start_time">
                <Col componentClass={ControlLabel} sm={3}>
                  Period
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    value={this.state.form.operation_hours[4].start_time}
                    placeholder="select"
                    onChange={this.operationHourChange}
                  >
                    <option value="">--- Not Set ---</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </FormControl>
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

              <FormGroup controlId="sat_operation_hours-start_time">
                <Col componentClass={ControlLabel} sm={3}>
                  Period
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    value={this.state.form.operation_hours[5].start_time}
                    placeholder="select"
                    onChange={this.operationHourChange}
                  >
                    <option value="">--- Not Set ---</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </FormControl>
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

              <FormGroup controlId="sun_operation_hours-start_time">
                <Col componentClass={ControlLabel} sm={3}>
                  Period
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    value={this.state.form.operation_hours[6].start_time}
                    placeholder="select"
                    onChange={this.operationHourChange}
                  >
                    <option value="">--- Not Set ---</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </FormControl>
                </Col>
              </FormGroup>
            </Form>
            <hr/>
            {this.state.form.provider_category === "Volunteer/Goods Donor" &&
              <div>
              <FormGroup controlId="start_date">
                <Col componentClass={ControlLabel} sm={3}>
                  Start date for availability
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="date"
                    value={this.state.form.start_date}
                    onChange={this.formValChange}/>
                </Col>
              </FormGroup>

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
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </FormControl>
                </Col>
              </FormGroup>

              <FormGroup controlId="commitment">
                <Col componentClass={ControlLabel} sm={3}>
                  Commitment length
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    value={this.state.form.commitment}
                    onChange={this.formValChange}
                  >
                    <option value="">--- Not Set ---</option>
                    <option value="Short term">Short term</option>
                    <option value="Six months">Six months</option>
                    <option value="One year">One year</option>
                  </FormControl>
                </Col>
              </FormGroup>

              <FormGroup controlId="skills">
                <Col componentClass={ControlLabel} sm={3}>
                  Skills
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    placeholder=""
                    value={this.state.form.skills}
                    onChange={this.formValChange}
                  />
                </Col>
              </FormGroup>

              <FormGroup controlId="education">
                <Col componentClass={ControlLabel} sm={3}>
                  Education/Training
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    placeholder="Please describe the education and training you have received"
                    value={this.state.form.education}
                    onChange={this.formValChange}
                  />
                </Col>
            </FormGroup>

            <FormGroup controlId="employment">
                <Col componentClass={ControlLabel} sm={3}>
                  Employment
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    placeholder="Please tell us about your work experience, area(s) of expertise, and/or area(s) of 
                                 knowledge"
                    value={this.state.form.employment}
                    onChange={this.formValChange}
                  />
                </Col>
            </FormGroup>

            <FormGroup controlId="experience">
                <Col componentClass={ControlLabel} sm={3}>
                  Volunteering experience
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    placeholder="Please describe the length and nature of any previous volunteer experience"
                    value={this.state.form.experience}
                    onChange={this.formValChange}
                  />
                </Col>
            </FormGroup>

            <FormGroup controlId="interests">
                <Col componentClass={ControlLabel} sm={3}>
                  Interests/hobbies
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    placeholder="Please tell us about your special skills, interests, or hobbies"
                    value={this.state.form.interests}
                    onChange={this.formValChange}
                  />
                </Col>
            </FormGroup>

            <FormGroup controlId="reason_for_volunteering">
                <Col componentClass={ControlLabel} sm={3}>
                  Reason for volunteering
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    placeholder="Please tell us why you would like to volunteer with us"
                    value={this.state.form.reason_for_volunteering}
                    onChange={this.formValChange}
                  />
                </Col>
            </FormGroup>

            <FormGroup controlId="affiliation">
                <Col componentClass={ControlLabel} sm={3}>
                  Organization affiliation
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    placeholder="If you are affiliated with a particular organization (such as a synagogue, a JCC, or 
                                 a school), please write the organization's name"
                    value={this.state.form.affiliation}
                    onChange={this.formValChange}
                  />
                </Col>
            </FormGroup>

            <hr/>
              <h4> References </h4>
              <hr/>
              <FormGroup controlId="reference1_name">
                <Col componentClass={ControlLabel} sm={3}>
                  Name
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.reference1_name}
                    placeholder="" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="reference1_phone">
                <Col componentClass={ControlLabel} sm={3}>
                  Phone
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.reference1_phone}
                    placeholder="" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="reference1_email">
                <Col componentClass={ControlLabel} sm={3}>
                  Email
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.reference1_email}
                    placeholder="" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <hr/>
              <FormGroup controlId="reference2_name">
                <Col componentClass={ControlLabel} sm={3}>
                  Name
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.reference2_name}
                    placeholder="" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="reference2_phone">
                <Col componentClass={ControlLabel} sm={3}>
                  Phone
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.reference2_phone}
                    placeholder="" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="reference2_email">
                <Col componentClass={ControlLabel} sm={3}>
                  Email
                </Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.form.reference2_email}
                    placeholder="" onChange={this.formValChange}/>
                </Col>
              </FormGroup>

              <hr/>
            </div>
            }

            <FormGroup controlId="status">
              <Col className="required" componentClass={ControlLabel} sm={3}>
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
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Allow other agencies to see this provider?
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
                  componentClass="textarea"
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
            </div>
          }
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
export default connect(mapStateToProps)(withRouter(ProviderForm));
