import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import _ from 'lodash';

// redux
import { connect } from 'react-redux'
import { createService, updateService } from '../../store/actions/serviceActions.js'
import { fetchProviders } from '../../store/actions/providerActions.js'


import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

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
      form: {
        name: service.name || '',
        desc: service.desc || '',
        category: service.category || '',
        available_from: service.available_from || '',
        available_to: service.available_to || '',
        language: service.language || '',
        capacity: service.capacity || '',
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
        provider_id: (service.provider && service.provider.id) || ''
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('services'));
    this.props.dispatch(fetchOntologyCategories('languages'));
    this.props.dispatch(fetchProviders());
  }

  formValChange(e) {
    let nextForm = {...this.state.form, [e.target.id]: e.target.value};
    this.setState({ form: nextForm });
  }

  locationChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['location'][e.target.id] = e.target.value
    this.setState({ form: nextForm });
  }

  submit() {
    if (this.state.mode === 'edit') {
      let form = Object.assign({}, this.state.form);
      this.props.dispatch(updateService(this.state.serviceId, form));
    } else {
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


    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{formTitle}</h3>
          <hr />
        </Col>
        <Col sm={12}>
          <Form horizontal>
            <FormGroup controlId="name">
              <Col componentClass={ControlLabel} sm={3}>
                Name
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
                Category
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

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Contact Person Email
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

            <FormGroup controlId="provider_id">
              <Col componentClass={ControlLabel} sm={3}>
                Provider
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
    providersLoaded: state.providers.loaded
  }
}

export default connect(mapStateToProps)(withRouter(ServiceForm));
