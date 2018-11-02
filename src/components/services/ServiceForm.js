import _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { statusInCanadaOptions, educationLevelOptions,
  serviceSharedWithOptions, serviceTypeOptions } from '../../store/defaults'
import GeneralField from '../shared/GeneralField'
import SelectField from '../shared/SelectField'
import CheckboxField from '../shared/CheckboxField'
import RadioField from '../shared/RadioField'
import MultiSelectField from '../shared/MultiSelectField';
import { formatLocation } from '../../helpers/location_helpers.js';
import { newMultiSelectFieldValue } from '../../helpers/select_field_helpers';

// redux
import { connect } from 'react-redux'
import { createService, updateService, SERVICE_ERROR, SERVICE_SUCCESS } from '../../store/actions/serviceActions.js'
import { fetchProviders } from '../../store/actions/providerActions.js';


import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Radio } from 'react-bootstrap';


class ServiceForm extends Component {
  constructor(props) {
    super(props);
    let service = {};
    if (this.props.match.params.id) {
      service = this.props.servicesById[this.props.match.params.id];
    }

    this.state = {
      serviceId: service.id,
      mode: (service.id) ? 'edit' : 'new',
      is_provider_location: false,
      form: {
        name: service.name || '',
        type: service.type || '',
        desc: service.desc || '',
        category: service.category || '',
        available_from: service.available_from || '',
        available_to: service.available_to || '',
        language: service.language || '',
        capacity: service.capacity || '',
        frequency: service.frequency || '',
        billable: service.billable || '',
        price: service.price || '',
        method_of_delivery: service.method_of_delivery || '',
        method_of_registration: service.method_of_registration || '',
        registration: service.registration || '',
        email: service.email || '',
        primary_phone_number: service.primary_phone_number || '',
        alt_phone_number: service.alt_phone_number || '',
        location: Object.assign({
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
        }, service.location),
        share_with: service.share_with || [],
        notes: service.notes || '',
        eligibility_conditions: Object.assign({
          'upper_age_limit': '',
          'lower_age_limit': '',
          'immigration_status': [],
          'current_education_level': [],
          'completed_education_level': []
        }, service.eligibility_conditions),
        provider_id: (service.provider && service.provider.id) || '',
        is_public: service.is_public || false
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.submit = this.submit.bind(this);
    this.indicatorChange = this.indicatorChange.bind(this);
    this.conditionsChange = this.conditionsChange.bind(this);
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('services'));
    this.props.dispatch(fetchOntologyCategories('languages'));
    this.props.dispatch(fetchProviders());
  }

  conditionsChange(e, id=e.target.id) {
    let nextForm = _.clone(this.state.form);

    if (id === "upper_age_limit" || id === "lower_age_limit") {
      nextForm['eligibility_conditions'][id] = e.target.value;
    }
    else {
      if (e.target.checked) {
        if (!nextForm['eligibility_conditions'][id]) {
          nextForm['eligibility_conditions'][id] = [];
        }
        nextForm['eligibility_conditions'][id].push(e.target.value)
      } else {
        _.remove(nextForm['eligibility_conditions'][id], (condition) => {
          return condition === e.target.value
        });
      }
    }
    this.setState({form: nextForm});
  }

  handleMultiSelectChange(id, selectedOption, actionMeta) {
    const preValue = this.state.form[id]
    const newValue = newMultiSelectFieldValue(preValue, selectedOption, actionMeta)

    this.setState({
      form: {
        ...this.state.form,
        [id]: newValue
      }
    });
  }

  formValChange(e, id=e.target.id) {
    let nextForm;
    if (id === 'location' || id === 'is_public') {
      nextForm = {...this.state.form, [id]: JSON.parse(e.target.value)};
    }
    else {
      nextForm = {...this.state.form, [id]: e.target.value};
    }
    this.setState({ form: nextForm });
  }

  locationChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['location'][e.target.id] = e.target.value
    this.setState({ form: nextForm });
  }

  indicatorChange(e, id) {
    this.setState({ [id] : JSON.parse(e.target.value) });
  }

  submit() {
    let form = Object.assign({}, this.state.form);
    form['eligibility_conditions']['age'] = [
      form['eligibility_conditions']['lower_age_limit'] || null,
      form['eligibility_conditions']['upper_age_limit'] || null
    ]
    delete form['eligibility_conditions']['lower_age_limit']
    delete form['eligibility_conditions']['upper_age_limit']
    if (this.state.mode === 'edit') {
      this.props.dispatch(
        updateService(this.state.serviceId, form, (status, err, serviceId) => {
        if (status === SERVICE_SUCCESS) {
          this.props.history.push('/services')
        } else {
          const error_messages =
            _.reduce(JSON.parse(err.message), (result, error_messages, field) => {
              const titleizedField = (field.charAt(0).toUpperCase() + field.slice(1))
                .split('_').join(' ')
              _.each(error_messages, message => {
                result.push(message.replace('This field', titleizedField))
              })
              return result;
            }, [])
          this.setState({ showAlert: true, error_messages: error_messages });
        }
      }));
    } else {
      this.props.dispatch(
        createService(this.state.form, (status, err, serviceId) => {
        if (status === SERVICE_SUCCESS) {
          this.props.history.push('/services')
        } else {
          const error_messages =
            _.reduce(JSON.parse(err.message), (result, error_messages, field) => {
              const titleizedField = (field.charAt(0).toUpperCase() + field.slice(1))
                .split('_').join(' ')
              _.each(error_messages, message => {
                result.push(message.replace('This field', titleizedField))
              })
              return result;
            }, [])
          this.setState({ showAlert: true, error_messages: error_messages });
        }
      }));
    }
  }

  render() {
    const p = this.props;
    debugger
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Service Profile' : 'New Service'

    let provider;
    if (this.state.form.provider_id) {
      provider = this.props.providersById && this.props.providersById[this.state.form.provider_id];
    }

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{formTitle}</h3>
          <hr />
        </Col>
        <Col sm={12}>
            <Form horizontal>
            {this.state.showAlert &&
              <Col sm={12} className="flash-error">
                {_.map(this.state.error_messages, (message, index) => {
                  return (
                    <li key={index}>
                      {message}
                    </li>
                  );
                })}
              </Col>
            }

            <SelectField
              id="provider_id"
              label="Provider"
              options={_.reduce(p.providers, (map, provider) => {
                if (provider.provider_type === 'Individual') {
                  map[provider.id] = provider.first_name + " " + provider.last_name;
                } else {
                  map[provider.id] = provider.company
                }
                return map;
              }, {})}
              componentClass="select"
              value={this.state.form.provider_id}
              onChange={this.formValChange}
              required
            />
            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Link to={`/providers/new`}>
                  <Button>
                    Add new provider
                  </Button>
                </Link>
              </Col>
            </FormGroup>
            <SelectField
              id="type"
              label="Type"
              options={serviceTypeOptions}
              componentClass="select"
              value={this.state.form.type}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="name"
              label="Name"
              type="text"
              value={this.state.form.name}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="desc"
              label="Description"
              type="text"
              value={this.state.form.desc}
              onChange={this.formValChange}
            />
            <SelectField
              id="category"
              label="Category"
              options={p.servicesCategories}
              componentClass="select"
              value={this.state.form.category}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="available_from"
              label="Available from"
              type="date"
              value={this.state.form.available_from}
              onChange={this.formValChange}
            />
            <GeneralField
              id="available_to"
              label="Available until"
              type="date"
              value={this.state.form.available_to}
              onChange={this.formValChange}
            />
            <SelectField
              id="language"
              label="Language"
              options={p.languagesCategories}
              componentClass="select"
              value={this.state.form.language}
              onChange={this.formValChange}
            />
            <GeneralField
              id="capacity"
              label="Capacity"
              type="text"
              value={this.state.form.capacity}
              onChange={this.formValChange}
            />
            <FormGroup controlId="frequency">
              <Col componentClass={ControlLabel} sm={3}>
                Frequency
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.frequency}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Biweekly">Biweekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Non-repeated">Non-repeated</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId="billable">
              <Col componentClass={ControlLabel} sm={3}>
                Billable
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.billable}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </FormControl>
              </Col>
            </FormGroup>
            {this.state.form.billable === "Yes" &&
              <GeneralField
                id="price"
                label="Price"
                type="text"
                value={this.state.form.price}
                onChange={this.formValChange}
              />
            }
            <FormGroup controlId="method_of_delivery">
              <Col componentClass={ControlLabel} sm={3}>
                Method of delivery
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.method_of_delivery}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Online">Online</option>
                  <optgroup label="In person">
                  <option value="One on one">One on one</option>
                  <option value="Group">Group</option>
                  </optgroup>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="method_of_registration">
              <Col componentClass={ControlLabel} sm={3}>
                Method of registration
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.method_of_registration}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Self registration">Self registration</option>
                  <option value="Registration by social worker">Registration by social worker</option>
                  <option value="No registration">No registration</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="registration">
              <Col componentClass={ControlLabel} sm={3}>
                Registration
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.registration}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Online">Online</option>
                  <option value="In person">In person</option>
                  <option value="By phone">By phone</option>
                </FormControl>
              </Col>
            </FormGroup>

            <hr/>
            <h3>Eligibility</h3>
            <CheckboxField
              id="immigration_status"
              label="Immigration Status"
              options={statusInCanadaOptions}
              checkedOptions={this.state.form.eligibility_conditions.immigration_status}
              onChange={this.conditionsChange}
            />
            <GeneralField
              id="lower_age_limit"
              label="Age greater than"
              type="text"
              value={this.state.form.eligibility_conditions.lower_age_limit}
              onChange={this.conditionsChange}
            />
            <GeneralField
              id="upper_age_limit"
              label="Age less than"
              type="text"
              value={this.state.form.eligibility_conditions.upper_age_limit}
              onChange={this.conditionsChange}
            />
            <CheckboxField
              id="current_education_level"
              label="Current Education"
              options={educationLevelOptions}
              checkedOptions={this.state.form.eligibility_conditions.current_education_level}
              onChange={this.conditionsChange}
            />
            <CheckboxField
              id="completed_education_level"
              label="Completed Education Level"
              options={educationLevelOptions}
              checkedOptions={this.state.form.eligibility_conditions.completed_education_level}
              onChange={this.conditionsChange}
            />
            <hr/>
            <h3>Contact Information</h3>
            <GeneralField
              id="email"
              label="Contact Person Email"
              type="email"
              value={this.state.form.email}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="primary_phone_number"
              label="Telephone"
              type="tel"
              value={this.state.form.primary_phone_number}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="alt_phone_number"
              label="Alternative Phone Number"
              type="tel"
              value={this.state.form.alt_phone_number}
              onChange={this.formValChange}
              required
            />
            <RadioField
              id="is_provider_location"
              label="Location"
              options={{ 'Same as provider': true, 'Other': false }}
              onChange={this.indicatorChange}
              defaultChecked={this.state.is_provider_location}
              required
            />
            {this.state.is_provider_location && this.state.form.provider_id &&
              <div>
                <FormGroup controlId="location">
                  <Col className="required" componentClass={ControlLabel} sm={3}>
                    Select the location this service is provided at
                  </Col>
                  <Col sm={9}>
                    <Radio
                      name="provider_address"
                      value={JSON.stringify(provider.main_address)}
                      onChange={(e) => this.formValChange(e, 'location')}
                    >
                      {formatLocation(provider.main_address)}
                    </Radio>{' '}
                    {provider.other_addresses &&
                     provider.other_addresses.map((address, index) =>
                      <Radio
                        name="provider_address"
                        value={JSON.stringify(address)}
                        onChange={(e) => this.formValChange(e, 'location')}
                        key={index}
                      >
                        {formatLocation(address)}
                      </Radio>
                    )}
                  </Col>
                </FormGroup>
              </div>
            }
            {!this.state.is_provider_location &&
            <div>
              <GeneralField
                id="street_address"
                label="Street Address"
                type="text"
                value={this.state.form.location.street_address}
                onChange={this.locationChange}
              />
              <GeneralField
                id="apt_number"
                label="Apt. #"
                type="text"
                value={this.state.form.location.apt_number}
                onChange={this.locationChange}
              />
              <GeneralField
                id="city"
                label="City"
                type="text"
                value={this.state.form.location.city}
                onChange={this.locationChange}
              />
              <GeneralField
                id="province"
                label="Province"
                type="text"
                value={this.state.form.location.province}
                onChange={this.locationChange}
              />
              <GeneralField
                id="postal_code"
                label="Postal Code"
                type="text"
                value={this.state.form.location.postal_code}
                onChange={this.locationChange}
              />
            </div>
            }
            <RadioField
              id="is_public"
              label="Public?"
              options={{ 'Yes': true, 'No': false }}
              onChange={this.formValChange}
              defaultChecked={this.state.form.is_public}
              required
            />
            <MultiSelectField
              id="share_with"
              label="Share with"
              options={serviceSharedWithOptions}
              value={this.state.form.share_with}
              onChange={this.handleMultiSelectChange}
            />
            <GeneralField
              id="notes"
              label="Notes"
              type="text"
              value={this.state.form.notes}
              onChange={this.formValChange}
            />
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
    servicesById: state.services.byId,
    servicesCategories: state.ontology.services.categories,
    categoriesLoaded: state.ontology.services.loaded,
    languagesCategories: state.ontology.languages.categories,
    languagesLoaded: state.ontology.languages.loaded,
    providers: state.providers.filteredProviders || [],
    providersById: state.providers.byId,
    providersLoaded: state.providers.loaded,
    providerIndex: state.providers.index
  }
}

export default connect(mapStateToProps)(withRouter(ServiceForm));
