import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { statusInCanadaOptions, educationLevelOptions } from '../../store/defaults'
import FormField from '../shared/FormField'
import CheckboxField from '../shared/CheckboxField'
import _ from 'lodash';

// redux
import { connect } from 'react-redux'
import { createService, updateService } from '../../store/actions/serviceActions.js'
import { fetchProviders } from '../../store/actions/providerActions.js';
import { formatLocation } from '../../helpers/location_helpers.js';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Radio, Panel, PanelGroup, Checkbox} from 'react-bootstrap';


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
      is_provider_location: '',
      age_restriction: '',
      form: {
        name: service.name || '',
        type_of_service: service.type_of_service || '',
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
        share_with: service.share_with || '',
        notes: service.notes || '',
        eligibility_conditions: Object.assign({
          'upper_age_limit': '',
          'lower_age_limit': '',
          'immigration_status': [],
          'current_education_level': [],
          'completed_education_level': []
        }, service.eligibility_conditions),
        provider_id: (service.provider && service.provider.id) || ''
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.submit = this.submit.bind(this);
    this.indicatorChange = this.indicatorChange.bind(this);
    this.conditionsChange = this.conditionsChange.bind(this);
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

  formValChange(e, id=e.target.id) {
    let nextForm;
    if (id === 'location') {
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
    this.setState({ [id] : e.target.value });
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
      this.props.dispatch(updateService(this.state.serviceId, form));
    } else {
      console.log(this.state.form);
      this.props.dispatch(createService(this.state.form));
    }
    this.props.history.push('/services')
  }

  render() {
    const p = this.props;

    const formTitle = (this.state.mode === 'edit') ?
      'Edit Service Profile' : 'New Service'

    function categoriesIntoOptions(categories) {
      return categories.map((category) => {
        return <option key={category} value={ category }>{category}</option>
      })
    }

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
            <FormGroup controlId="provider_id">
              <Col componentClass={ControlLabel} sm={3}>
                Provider *
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.provider_id}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  {p.providers.map(provider =>
                    <option key={provider.id} value={provider.id}>
                      {provider.first_name + " " + provider.last_name}
                    </option>
                  )}
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Link to={`/providers/new`}>
                  <Button>
                    Add new provider
                  </Button>
                </Link>
              </Col>
            </FormGroup>

            <FormGroup controlId="type_of_service">
              <Col componentClass={ControlLabel} sm={3}>
                Type *
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.type_of_service}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Volunteer based">Volunteer based</option>
                  <option value="Professional/Community">Professional/Community</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="name">
              <Col componentClass={ControlLabel} sm={3}>
                Name *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="desc">
              <Col componentClass={ControlLabel} sm={3}>
                Description
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.desc} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="category">
              <Col componentClass={ControlLabel} sm={3}>
                Category *
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.category}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option key="Shelter" value="Shelter"> Shelter </option>
                  { p.categoriesLoaded &&
                    categoriesIntoOptions(p.servicesCategories)
                  }

                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="available_from">
              <Col componentClass={ControlLabel} sm={3}>
                Available from
              </Col>
              <Col sm={9}>
                <FormControl
                  type="date"
                  value={this.state.form.available_from}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="available_to">
              <Col componentClass={ControlLabel} sm={3}>
                Available until
              </Col>
              <Col sm={9}>
                <FormControl
                  type="date"
                  value={this.state.form.available_to}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="language">
              <Col componentClass={ControlLabel} sm={3}>
                Language
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.language}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option key = "English" value="English"> English </option>
                  { p.languagesLoaded &&
                    categoriesIntoOptions(p.languagesCategories)
                  }
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="capacity">
              <Col componentClass={ControlLabel} sm={3}>
                Capacity
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.capacity}
                  placeholder=""
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="frequency">
              <Col componentClass={ControlLabel} sm={3}>
                Frequency
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.frequency}
                  placeholder=""
                  onChange={this.formValChange}
                />
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
            <FormGroup controlId="price">
              <Col componentClass={ControlLabel} sm={3}>
                Price
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.price}
                  placeholder=""
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>
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
                handleFormValChange={this.conditionsChange}
              />
              <FormField
                id="lower_age_limit"
                label="Age greater than"
                type="text"
                value={this.state.form.eligibility_conditions.lower_age_limit}
                onChange={this.conditionsChange}
              />
              <FormField
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
                handleFormValChange={this.conditionsChange}
              />
              <CheckboxField
                id="completed_education_level"
                label="Completed Education Level"
                options={educationLevelOptions}
                checkedOptions={this.state.form.eligibility_conditions.completed_education_level}
                handleFormValChange={this.conditionsChange}
              />
            <hr/>


            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Contact Person Email *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.email}
                  placeholder=""
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

            <FormGroup controlId="alt_phone_number">
              <Col componentClass={ControlLabel} sm={3}>
                Alternative Phone Number *
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  value={this.state.form.alt_phone_number}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="is_provider_location">
              <Col className="required" componentClass={ControlLabel} sm={3}>
                Location
              </Col>
              <Col sm={9}>
                <Radio
                  name="is_provider_location"
                  value='true'
                  onChange={e => this.indicatorChange(e, 'is_provider_location')}
                  inline
                >
                  Same as provider
                </Radio>{' '}
                <Radio
                  name="is_provider_location"
                  value='false'
                  onChange={e => this.indicatorChange(e, 'is_provider_location')}
                  inline
                >
                  Other
                </Radio>{' '}
              </Col>
            </FormGroup>

            {this.state.is_provider_location === 'true' && this.state.form.provider_id &&
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
                    { provider.other_addresses.map((address, index) =>
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
            {this.state.is_provider_location === 'false' &&
            <div>
              <FormGroup controlId="street_address">
                <Col componentClass={ControlLabel} sm={3}>
                  Street Address
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="text"
                    value={this.state.form.location.street_address}
                    onChange={this.locationChange}
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
                    value={this.state.form.location.apt_number}
                    onChange={this.locationChange}
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
                    value={this.state.form.location.city}
                    onChange={this.locationChange}
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
                    value={this.state.form.location.province}
                    onChange={this.locationChange}
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
                    value={this.state.form.location.postal_code}
                    onChange={this.locationChange}
                  />
                </Col>
              </FormGroup>
            </div>
            }

            <FormGroup controlId="share_with">
              <Col componentClass={ControlLabel} sm={3}>
                Share with
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.share_with}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Boost Child & Youth Advocacy Centre">Boost Child & Youth Advocacy Centre</option>
                  <option value="Children's Aid Society of Toronto">Children's Aid Society of Toronto</option>
                  <option value="Abrigo Centre">Abrigo Centre</option>
                  <option value="Barbra Schlifer Commemorative Clinic">Barbra Schlifer Commemorative Clinic</option>
                  <option value="Durham Rape Crisis Centre">Durham Rape Crisis Centre</option>
                  <option value="Durham Children's Aid Society">Durham Children's Aid Society</option>
                  <option value="Alexandra Park Community Centre">Alexandra Park Community Centre</option>
                  <option value="Applegrove Community Complex">Applegrove Community Complex</option>
                  <option value="Albion Neighbourhood Services">Albion Neighbourhood Services</option>
                  <option value="Applegrove Community Complex">Applegrove Community Complex</option>
                  <option value="Kababayan Multicultural Centre">Kababayan Multicultural Centre</option>
                  <option value="Central Toronto Youth Services">Central Toronto Youth Services</option>
                  <option value="Covenant House Toronto">Covenant House Toronto</option>
                  <option value="Durham Youth Housing and Support Services">Durham Youth Housing and Support Services</option>
                  <option value="Eva's Initiatives">Eva's Initiatives</option>
                  <option value="Horizons for Youth">Horizons for Youth</option>
                  <option value="AIDS Committee of Durham Region">AIDS Committee of Durham Region</option>
                  <option value="Arab Community Centre of Toronto">Arab Community Centre of Toronto</option>
                  <option value="Pediatric Oncology Group of Ontario">Pediatric Oncology Group of Ontario</option>
                  <option value="Adventist community services">Adventist community services</option>
                  <option value="Aurora Food Pantry">Aurora Food Pantry</option>
                  <option value="Bluffs Food Bank">Bluffs Food Bank</option>
                  <option value="Brock Community Food Bank">Brock Community Food Bank</option>
                  <option value="Markham Food Bank">Markham Food Bank</option>
                  <option value="Parkdale Community Food Bank">Parkdale Community Food Bank</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="notes">
              <Col componentClass={ControlLabel} sm={3}>
                Notes
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.notes}
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
