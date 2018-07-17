import React, { Component } from 'react';
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
              onChange={this.props.formValChangeHandler}
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
              onChange={this.props.formValChangeHandler}
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
              onChange={this.props.formValChangeHandler}
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
              onChange={this.props.formValChangeHandler}
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
              onChange={this.props.formValChangeHandler}
            >
              <option value="select">--- Not Set ---</option>
              <option value="Other">Other</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
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
              onChange={this.props.formValChangeHandler}
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
              onChange={this.props.formValChangeHandler}
            >
              <option value="select">--- Not Set ---</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Common Law">Common Law</option>
              <option value="Separated">Separated</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </FormControl>
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
              onChange={e => this.props.formValChangeHandler(e, 'has_children')}
              defaultChecked={this.props.personalInformation.has_children === true}
              inline
            >
              Yes
            </Radio>{' '}
            <Radio
              name="radioGroup"
              value='false'
              onChange={e => this.props.formValChangeHandler(e, 'has_children')}
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
                onChange={this.props.formValChangeHandler}
              />
            </Col>
          </FormGroup>
        )}
      </Row>
    );
  }
}
