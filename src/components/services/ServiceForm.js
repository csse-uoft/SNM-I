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
        availability: service.availability || '',
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

            <FormGroup controlId="availability">
              <Col componentClass={ControlLabel} sm={3}>
                Availability
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.availability}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="food">1 week</option>
                  <option value="clothing">1 month</option>
                  <option value="utensils">6 months</option>
                  <option value="utensils">1 year</option>
                </FormControl>
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
