import React, { Component } from 'react';
import { withRouter } from 'react-router';

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
        email: service.email || '',
        mobile_phone: (service.phone_numbers && service.phone_numbers.length > 0) ?
          getPhoneNumber(service.phone_numbers, 'mobile') : '',
        home_phone: (service.phone_numbers && service.phone_numbers.length > 0) ?
          getPhoneNumber(service.phone_numbers, 'home') : '',
        address: (service.locations && service.locations.length > 0) ?
          service.locations[0].properties.address : '',
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
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
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Service Profile' : 'New Service'
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
                Name (required)
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder="Aravind"
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
                <FormControl type="text" value={this.state.form.preferred_name} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.email}
                  placeholder="aravind.adiga.gmail.com"
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="mobile_phone">
              <Col componentClass={ControlLabel} sm={3}>
                Cell Phone
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  value={this.state.form.mobile_phone}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="home_phone">
              <Col componentClass={ControlLabel} sm={3}>
                Home Phone (required)
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  value={this.state.form.home_phone}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="address">
              <Col componentClass={ControlLabel} sm={3}>
                Address
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
    servicesById: state.services.byId
  }
}

function getPhoneNumber(phoneNumbers, phoneType) {
  let matchedNumber = null
  phoneNumbers.forEach(function(phoneNumber) {
    if (phoneNumber.phone_type === phoneType) {
      matchedNumber = phoneNumber.phone_number
    }
  });
  return matchedNumber
}

export default connect(mapStateToProps)(withRouter(ServiceForm));
