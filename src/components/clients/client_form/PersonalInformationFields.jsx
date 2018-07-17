import React, { Component } from 'react';
import { genderOptions, maritalStatusOptions } from '../../../store/defaults.js';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row,
  Radio, Checkbox } from 'react-bootstrap';

export default class PersonalInformationFields extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row>
        <FormGroup controlId="first_name">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            First name
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={this.props.personalInformation.first_name}
              onChange={this.props.handleFormValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="middle_name">
          <Col componentClass={ControlLabel} sm={3}>
            Middle name
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={this.props.personalInformation.middle_name}
              onChange={this.props.handleFormValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="last_name">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            Last name
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={this.props.personalInformation.last_name}
              onChange={this.props.handleFormValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="preferred_name">
          <Col componentClass={ControlLabel} sm={3}>
            Preferred Name
          </Col>
          <Col sm={9}>
            <FormControl type="text"
              value={this.props.personalInformation.preferred_name}
              onChange={this.props.handleFormValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="gender">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            Gender
          </Col>
          <Col sm={9}>
            <FormControl
              componentClass="select"
              placeholder="select"
              value={this.props.personalInformation.gender}
              onChange={this.props.handleFormValChange}
            >
              <option value="select">--- Not Set ---</option>
              {genderOptions.map(gender =>
                <option key={gender} value={gender}>{gender}</option>
              )}
            </FormControl>
          </Col>
        </FormGroup>

        <FormGroup controlId="birth_date">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            Date of Birth
          </Col>
          <Col sm={9}>
            <FormControl
              type="date"
              value={this.props.personalInformation.birth_date}
              onChange={this.props.handleFormValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="marital_status">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            Marital Status
          </Col>
          <Col sm={9}>
            <FormControl
              componentClass="select"
              placeholder="select"
              value={this.props.personalInformation.marital_status}
              onChange={this.props.handleFormValChange}
            >
              <option value="select">--- Not Set ---</option>
              {maritalStatusOptions.map(maritalStatus =>
                <option key={maritalStatus} value={maritalStatus}>
                  {maritalStatus}
                </option>
              )}
            </FormControl>
          </Col>
        </FormGroup>

        <FormGroup controlId="email">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            Email
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={this.props.personalInformation.email}
              onChange={this.props.handleFormValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="primary_phone_number">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            Telephone
          </Col>
          <Col sm={9}>
            <FormControl
              type="tel"
              value={this.props.personalInformation.primary_phone_number}
              onChange={this.props.handleFormValChange}
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
              value={this.props.personalInformation.alt_phone_number}
              onChange={this.props.handleFormValChange}
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
              value={this.props.personalInformation.address.apt_number}
              onChange={this.props.addressChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="street_address">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            Street Address
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={this.props.personalInformation.address.street_address}
              onChange={this.props.addressChange}
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
              value={this.props.personalInformation.address.city}
              onChange={this.props.addressChange}
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
              value={this.props.personalInformation.address.province}
              onChange={this.props.addressChange}
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
              value={this.props.personalInformation.address.postal_code}
              onChange={this.props.addressChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="has_children">
          <Col className="required" componentClass={ControlLabel} sm={3}>
            Do you have children?
          </Col>
          <Col sm={9}>
            <Radio
              name="radioGroup"
              value='true'
              onChange={e => this.props.handleFormValChange(e, 'has_children')}
              defaultChecked={this.props.personalInformation.has_children === true}
              inline
            >
              Yes
            </Radio>{' '}
            <Radio
              name="radioGroup"
              value='false'
              onChange={e => this.props.handleFormValChange(e, 'has_children')}
              defaultChecked={this.props.personalInformation.has_children === false}
              inline
            >
              No
            </Radio>{' '}
          </Col>
        </FormGroup>

        {JSON.parse(this.props.personalInformation.has_children) && (
          <FormGroup controlId="num_of_children">
            <Col componentClass={ControlLabel} sm={3}>
              Number of Children
            </Col>
            <Col sm={9}>
              <FormControl
                type="number"
                value={this.props.personalInformation.num_of_children}
                onChange={this.props.handleFormValChange}
              />
            </Col>
          </FormGroup>
        )}
      </Row>
    );
  }
}
