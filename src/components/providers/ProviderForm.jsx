import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, Col, Row, Well, ListGroup } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'

import { createProvider, updateProvider } from '../../store/actions/providerActions.js'
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { formatLocation } from '../../helpers/location_helpers'
import { providerFields } from '../../constants/provider_fields.js'

// components
import FieldGroup from '../shared/FieldGroup';
import OperationHoursFieldGroup from '../shared/OperationHoursFieldGroup';
import LocationFieldGroup from '../shared/LocationFieldGroup';

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
      <Well>
        <LocationFieldGroup
          address={this.state.address}
          handleFormValChange={this.addressChange}
        />
        <Button onClick={this.submitClick}> Submit Address </Button>
      </Well>
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
    this.otherAddressChange = this.otherAddressChange.bind(this);
    this.toggleAddressButton = this.toggleAddressButton.bind(this);
    this.submitAddress = this.submitAddress.bind(this);
    this.removeOtherAddress = this.removeOtherAddress.bind(this);

    const id = this.props.match.params.id;
    const provider = id ? this.props.providersById[id] : {};
    const availability = [
      { week_day: 'Monday', start_time: "", end_time: "" },
      { week_day: 'Tuesday', start_time: "", end_time: "" },
      { week_day: 'Wednesday', start_time: "", end_time: "" },
      { week_day: 'Thursday', start_time: "", end_time: "" },
      { week_day: 'Friday', start_time: "", end_time: "" },
      { week_day: 'Saturday', start_time: "", end_time: "" },
      { week_day: 'Sunday', start_time: "", end_time: "" }
    ]

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
        other_addresses: provider.other_addresses || [],
        operation_hours: Object.assign(availability, provider.operation_hours),
        referrer: provider.referrer || '',
        own_car: provider.own_car || false,
        skills: provider.skills || '',
        visibility: provider.visibility || false,
        status: provider.status,
        notes: provider.notes || '',
        commitment: provider.commitment || '',
        start_date: provider.start_date || '',
        reference1_name: provider.reference1_name || '',
        reference1_phone: provider.reference1_phone || '',
        reference1_email: provider.reference1_email || '',
        reference2_name: provider.reference2_name || '',
        reference2_phone: provider.reference2_phone || '',
        reference2_email: provider.reference2_email || ''
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

  formValChange(e, id=e.target.id) {
    let next = {...this.state.form, [id] : e.target.value};
    this.setState({ form : next });
  }

  operationHourChange(e, weekDay, index) {
    let nextForm = _.clone(this.state.form);
    nextForm['operation_hours'][index][e.target.id] = e.target.value;
    this.setState({ form: nextForm });
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

  toggleAddressButton() {
    this.setState({ addressButtonClicked: !this.state.addressButtonClicked })
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
              <FieldGroup
                id='provider_type'
                label={providerFields['provider_type']['label']}
                type={providerFields['provider_type']['type']}
                component={providerFields['provider_type']['component']}
                value={this.state.form['provider_type']}
                onChange={this.formValChange}
                options={providerFields['provider_type']['options']}
              />
            }
            {this.state.form.provider_type === "Individual" &&
              <FieldGroup
                id='provider_category'
                label={providerFields['provider_category']['label']}
                type={providerFields['provider_category']['type']}
                component={providerFields['provider_category']['component']}
                value={this.state.form['provider_category']}
                onChange={this.formValChange}
                options={providerFields['provider_category']['options']}
              />
            }
            {this.state.form.provider_type === "Organization" &&
              <FieldGroup
                id='company'
                label={providerFields['company']['label']}
                type={providerFields['company']['type']}
                component={providerFields['company']['component']}
                value={this.state.form['company']}
                onChange={this.formValChange}
                options={providerFields['company']['options']}
              />
            }
            {this.state.form.provider_type &&
            <div>
            <hr/>
            <h4> Contact Information </h4>
            <hr/>
            <FieldGroup
              id='first_name'
              label={providerFields['first_name']['label']}
              type={providerFields['first_name']['type']}
              component={providerFields['first_name']['component']}
              value={this.state.form['first_name']}
              onChange={this.formValChange}
              options={providerFields['first_name']['options']}
            />
            <FieldGroup
              id='last_name'
              label={providerFields['last_name']['label']}
              type={providerFields['last_name']['type']}
              component={providerFields['last_name']['component']}
              value={this.state.form['last_name']}
              onChange={this.formValChange}
              options={providerFields['last_name']['options']}
            />
            <FieldGroup
              id='gender'
              label={providerFields['gender']['label']}
              type={providerFields['gender']['type']}
              component={providerFields['gender']['component']}
              value={this.state.form['gender']}
              onChange={this.formValChange}
              options={providerFields['gender']['options']}
            />
            <FieldGroup
              id='email'
              label={providerFields['email']['label']}
              type={providerFields['email']['type']}
              component={providerFields['email']['component']}
              value={this.state.form['email']}
              onChange={this.formValChange}
              options={providerFields['email']['options']}
            />
            <FieldGroup
              id='primary_phone_number'
              label={providerFields['primary_phone_number']['label']}
              type={providerFields['primary_phone_number']['type']}
              component={providerFields['primary_phone_number']['component']}
              value={this.state.form['primary_phone_number']}
              onChange={this.formValChange}
              options={providerFields['primary_phone_number']['options']}
            />
            <FieldGroup
              id='primary_phone_extension'
              label={providerFields['primary_phone_extension']['label']}
              type={providerFields['primary_phone_extension']['type']}
              component={providerFields['primary_phone_extension']['component']}
              value={this.state.form['primary_phone_extension']}
              onChange={this.formValChange}
              options={providerFields['primary_phone_extension']['options']}
            />
            <FieldGroup
              id='primary_phone_type'
              label={providerFields['primary_phone_type']['label']}
              type={providerFields['primary_phone_type']['type']}
              component={providerFields['primary_phone_type']['component']}
              value={this.state.form['primary_phone_type']}
              onChange={this.formValChange}
              options={providerFields['primary_phone_type']['options']}
            />
            <FieldGroup
              id='alt_phone_number'
              label={providerFields['alt_phone_number']['label']}
              type={providerFields['alt_phone_number']['type']}
              component={providerFields['alt_phone_number']['component']}
              value={this.state.form['alt_phone_number']}
              onChange={this.formValChange}
              options={providerFields['alt_phone_number']['options']}
            />
            <FieldGroup
              id='alt_phone_extension'
              label={providerFields['alt_phone_extension']['label']}
              type={providerFields['alt_phone_extension']['type']}
              component={providerFields['alt_phone_extension']['component']}
              value={this.state.form['alt_phone_extension']}
              onChange={this.formValChange}
              options={providerFields['alt_phone_extension']['options']}
            />
            <FieldGroup
              id='alt_phone_type'
              label={providerFields['alt_phone_type']['label']}
              type={providerFields['alt_phone_type']['type']}
              component={providerFields['alt_phone_type']['component']}
              value={this.state.form['alt_phone_type']}
              onChange={this.formValChange}
              options={providerFields['alt_phone_type']['options']}
            />
            </div>
            }

            {this.state.form.provider_type === "Organization" &&
            <div>
              <hr/>
              <h4> Secondary Contact Information </h4>
              <hr/>
              <FieldGroup
                id='sec_contact_first_name'
                label={providerFields['sec_contact_first_name']['label']}
                type={providerFields['sec_contact_first_name']['type']}
                component={providerFields['sec_contact_first_name']['component']}
                value={this.state.form['sec_contact_first_name']}
                onChange={this.formValChange}
                options={providerFields['sec_contact_first_name']['options']}
              />
              <FieldGroup
                id='sec_contact_last_name'
                label={providerFields['sec_contact_last_name']['label']}
                type={providerFields['sec_contact_last_name']['type']}
                component={providerFields['sec_contact_last_name']['component']}
                value={this.state.form['sec_contact_last_name']}
                onChange={this.formValChange}
                options={providerFields['sec_contact_last_name']['options']}
              />
              <FieldGroup
                id='sec_contact_email'
                label={providerFields['sec_contact_email']['label']}
                type={providerFields['sec_contact_email']['type']}
                component={providerFields['sec_contact_email']['component']}
                value={this.state.form['sec_contact_email']}
                onChange={this.formValChange}
                options={providerFields['sec_contact_email']['options']}
              />
              <FieldGroup
                id='sec_contact_primary_phone_number'
                label={providerFields['sec_contact_primary_phone_number']['label']}
                type={providerFields['sec_contact_primary_phone_number']['type']}
                component={providerFields['sec_contact_primary_phone_number']['component']}
                value={this.state.form['sec_contact_primary_phone_number']}
                onChange={this.formValChange}
                options={providerFields['sec_contact_primary_phone_number']['options']}
              />
              <FieldGroup
                id='sec_contact_primary_phone_extension'
                label={providerFields['sec_contact_primary_phone_extension']['label']}
                type={providerFields['sec_contact_primary_phone_extension']['type']}
                component={providerFields['sec_contact_primary_phone_extension']['component']}
                value={this.state.form['sec_contact_primary_phone_extension']}
                onChange={this.formValChange}
                options={providerFields['sec_contact_primary_phone_extension']['options']}
              />
              <FieldGroup
                id='sec_contact_alt_phone_number'
                label={providerFields['sec_contact_alt_phone_number']['label']}
                type={providerFields['sec_contact_alt_phone_number']['type']}
                component={providerFields['sec_contact_alt_phone_number']['component']}
                value={this.state.form['sec_contact_alt_phone_number']}
                onChange={this.formValChange}
                options={providerFields['sec_contact_alt_phone_number']['options']}
              />
              <FieldGroup
                id='sec_contact_alt_phone_extension'
                label={providerFields['sec_contact_alt_phone_extension']['label']}
                type={providerFields['sec_contact_alt_phone_extension']['type']}
                component={providerFields['sec_contact_alt_phone_extension']['component']}
                value={this.state.form['sec_contact_alt_phone_extension']}
                onChange={this.formValChange}
                options={providerFields['sec_contact_alt_phone_extension']['options']}
              />
              </div>
            }
            {this.state.form.provider_type &&
            <div>
            <hr/>
            <h4> Main Address </h4>
            <hr/>
            <LocationFieldGroup
              address={this.state.form.main_address}
              handleFormValChange={this.mainAddressChange}
            />
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
            <FieldGroup
              id='languages'
              label={providerFields['languages']['label']}
              type={providerFields['languages']['type']}
              component={providerFields['languages']['component']}
              value={this.state.form['languages']}
              onChange={this.languagesChange}
              options={providerFields['languages']['options'] || this.props.languagesCategories}
            />
            <FieldGroup
              id='referrer'
              label={providerFields['referrer']['label']}
              type={providerFields['referrer']['type']}
              component={providerFields['referrer']['component']}
              value={this.state.form['referrer']}
              onChange={this.formValChange}
              options={providerFields['referrer']['options']}
            />
            <hr/>
            <h4>Availability</h4>
            <hr/>
            <OperationHoursFieldGroup
              operationHours={this.state.form.operation_hours}
              handleFormValChange={this.operationHourChange}
            />
            <hr/>
            {this.state.form.provider_category === "Volunteer/Goods Donor" &&
              <div>
              <FieldGroup
                id='start_date'
                label={providerFields['start_date']['label']}
                type={providerFields['start_date']['type']}
                component={providerFields['start_date']['component']}
                value={this.state.form['start_date']}
                onChange={this.formValChange}
                options={providerFields['start_date']['options']}
              />
              <FieldGroup
                id='own_car'
                label={providerFields['own_car']['label']}
                type={providerFields['own_car']['type']}
                component={providerFields['own_car']['component']}
                value={this.state.form['own_car']}
                onChange={this.formValChange}
                options={providerFields['own_car']['options']}
              />
              <FieldGroup
                id='commitment'
                label={providerFields['commitment']['label']}
                type={providerFields['commitment']['type']}
                component={providerFields['commitment']['component']}
                value={this.state.form['commitment']}
                onChange={this.formValChange}
                options={providerFields['commitment']['options']}
              />
              <FieldGroup
                id='skills'
                label={providerFields['skills']['label']}
                type={providerFields['skills']['type']}
                component={providerFields['skills']['component']}
                value={this.state.form['skills']}
                onChange={this.formValChange}
                options={providerFields['skills']['options']}
              />
            <hr/>
              <h4>References</h4>
              <hr/>
              <FieldGroup
                id='reference1_name'
                label={providerFields['reference1_name']['label']}
                type={providerFields['reference1_name']['type']}
                component={providerFields['reference1_name']['component']}
                value={this.state.form['reference1_name']}
                onChange={this.formValChange}
                options={providerFields['reference1_name']['options']}
              />
              <FieldGroup
                id='reference1_phone'
                label={providerFields['reference1_phone']['label']}
                type={providerFields['reference1_phone']['type']}
                component={providerFields['reference1_phone']['component']}
                value={this.state.form['reference1_phone']}
                onChange={this.formValChange}
                options={providerFields['reference1_phone']['options']}
              />
              <FieldGroup
                id='reference1_email'
                label={providerFields['reference1_email']['label']}
                type={providerFields['reference1_email']['type']}
                component={providerFields['reference1_email']['component']}
                value={this.state.form['reference1_email']}
                onChange={this.formValChange}
                options={providerFields['reference1_email']['options']}
              />
              <hr/>
              <FieldGroup
                id='reference2_name'
                label={providerFields['reference2_name']['label']}
                type={providerFields['reference2_name']['type']}
                component={providerFields['reference2_name']['component']}
                value={this.state.form['reference2_name']}
                onChange={this.formValChange}
                options={providerFields['reference2_name']['options']}
              />
              <FieldGroup
                id='reference2_phone'
                label={providerFields['reference2_phone']['label']}
                type={providerFields['reference2_phone']['type']}
                component={providerFields['reference2_phone']['component']}
                value={this.state.form['reference2_phone']}
                onChange={this.formValChange}
                options={providerFields['reference2_phone']['options']}
              />
              <FieldGroup
                id='reference2_email'
                label={providerFields['reference2_email']['label']}
                type={providerFields['reference2_email']['type']}
                component={providerFields['reference2_email']['component']}
                value={this.state.form['reference2_email']}
                onChange={this.formValChange}
                options={providerFields['reference2_email']['options']}
              />
              <hr/>
            </div>
            }
            <FieldGroup
              id='status'
              label={providerFields['status']['label']}
              type={providerFields['status']['type']}
              component={providerFields['status']['component']}
              value={this.state.form['status']}
              onChange={this.formValChange}
              options={providerFields['status']['options']}
            />
            <FieldGroup
              id='visibility'
              label={providerFields['visibility']['label']}
              type={providerFields['visibility']['type']}
              component={providerFields['visibility']['component']}
              value={this.state.form['visibility']}
              onChange={this.formValChange}
              options={providerFields['visibility']['options']}
            />
            <FieldGroup
              id='notes'
              label={providerFields['notes']['label']}
              type={providerFields['notes']['type']}
              component={providerFields['notes']['component']}
              value={this.state.form['notes']}
              onChange={this.formValChange}
              options={providerFields['notes']['options']}
            />
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
