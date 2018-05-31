import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';

// redux
import { connect } from 'react-redux'
import { createService, updateService } from '../../store/actions/serviceActions.js'

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

class ServiceForm extends Component {
  constructor(props) {
    super(props);
    let service = {};
    if (this.props.match.params.id) {
      service = this.props.servicesById[this.props.match.params.id]
    }

    this.state = {
      serviceId: service.id,
      mode: (service.id) ? 'edit' : 'new',
      form: {
        name: service.name || '',
        desc: service.desc || '',
        category: service.category || '',
        language: service.language || '',
        capacity: service.capacity || '',
        email: service.email || '',
        primary_phone_number: service.primary_phone_number || '',
        alt_phone_number: service.alt_phone_number || '',
        address: (service.locations && service.locations.length > 0) ?
          service.locations[0].properties.address : '',
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('services'));
  }

  formValChange(e) {
    let nextForm = {...this.state.form, [e.target.id]: e.target.value};
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
                  { p.categoriesLoaded &&
                    categoriesIntoOptions(p.servicesCategories)
                  }
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="language">
              <Col componentClass={ControlLabel} sm={3}>
                Language
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.language}
                  placeholder=""
                  onChange={this.formValChange}
                />
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

            <FormGroup controlId="address">
              <Col componentClass={ControlLabel} sm={3}>
                Provider
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.address}
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
    categoriesLoaded: state.ontology.needs.loaded
  }
}

export default connect(mapStateToProps)(withRouter(ServiceForm));
