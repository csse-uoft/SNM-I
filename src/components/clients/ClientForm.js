import React, { Component } from 'react';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

export default class ClientForm extends Component {
  render() {
    return (
      <Row className="content">
        <Col sm={12}>
          <h3>New Named Client Profile</h3>
          <hr/>
        </Col>
        <Col sm={12}>
          <Form horizontal>
            <FormGroup controlId="first_name">
              <Col componentClass={ControlLabel} sm={3}>
                First name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue=""
                  placeholder="Aravind" />
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue=""
                  placeholder="Adiga" />
              </Col>
            </FormGroup>

            <FormGroup controlId="gender">
              <Col componentClass={ControlLabel} sm={3}>
                Gender
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select">
                  <option value="select">-- Not Set --</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="preferred_name">
              <Col componentClass={ControlLabel} sm={3}>
                Preferred Name
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="date_of_birth">
              <Col componentClass={ControlLabel} sm={3}>
                Date of Birth
              </Col>
              <Col sm={9}>
                <FormControl type="date" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="marital_status">
              <Col componentClass={ControlLabel} sm={3}>
                Marital Status
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select">
                  <option value="select">-- Not Set --</option>
                  <option value="married">Married</option>
                  <option value="single">Single</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue=""
                  placeholder="aravind.adiga.gmail.com" />
              </Col>
            </FormGroup>

            <FormGroup controlId="cell_phone">
              <Col componentClass={ControlLabel} sm={3}>
                Cell Phone
              </Col>
              <Col sm={9}>
                <FormControl type="tel" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="home_phone">
              <Col componentClass={ControlLabel} sm={3}>
                Home Phone (required)
              </Col>
              <Col sm={9}>
                <FormControl type="tel" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="address">
              <Col componentClass={ControlLabel} sm={3}>
                Address
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="family_code">
              <Col componentClass={ControlLabel} sm={3}>
                Family Code
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="landing_date">
              <Col componentClass={ControlLabel} sm={3}>
                Landing Date
              </Col>
              <Col sm={9}>
                <FormControl type="date" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="arrival_date">
              <Col componentClass={ControlLabel} sm={3}>
                Arrival Date
              </Col>
              <Col sm={9}>
                <FormControl type="date" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="re-entry_date">
              <Col componentClass={ControlLabel} sm={3}>
                Re-entry Date
              </Col>
              <Col sm={9}>
                <FormControl type="date" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="initial_destination">
              <Col componentClass={ControlLabel} sm={3}>
                Inital Destination
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue="" />
              </Col>
            </FormGroup>

            <FormGroup controlId="marital_status">
              <Col componentClass={ControlLabel} sm={3}>
                Country of Origin
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select">
                  <option value="select">-- Not Set --</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="marital_status">
              <Col componentClass={ControlLabel} sm={3}>
                Last Residence
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select">
                  <option value="select">-- Not Set --</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="marital_status">
              <Col componentClass={ControlLabel} sm={3}>
                Immi. Class
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select">
                  <option value="select">-- Not Set --</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="marital_status">
              <Col componentClass={ControlLabel} sm={3}>
                Immi. Status
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select">
                  <option value="select">-- Not Set --</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="marital_status">
              <Col componentClass={ControlLabel} sm={3}>
                Immi. Card Type
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select">
                  <option value="select">-- Not Set --</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="marital_status">
              <Col componentClass={ControlLabel} sm={3}>
                Aboriginal Status
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select">
                  <option value="select">-- Not Set --</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="marital_status">
              <Col componentClass={ControlLabel} sm={3}>
                Preferred Official Language
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select">
                  <option value="select">-- Not Set --</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button disabled={false} type="submit">
                  Submit
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    )
  }
}
