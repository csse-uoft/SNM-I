import React, { Component } from 'react';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

export default class AnonymousClientForm extends Component {
  render() {
    return (
      <Row className="content">
        <Col sm={12}>
          <h3>New Anonymous Client Profile</h3>
          <hr/>
        </Col>
        <Col sm={12}>
          <Form horizontal>
          <FormGroup controlId="client_name">
            <Col componentClass={ControlLabel} sm={3}>
              Client Name
            </Col>
            <Col sm={9}>
              Anonymous Client
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

          <FormGroup controlId="arrival_date">
            <Col componentClass={ControlLabel} sm={3}>
              Arrival Date
            </Col>
            <Col sm={9}>
              <FormControl type="date" />
            </Col>
          </FormGroup>

          <FormGroup controlId="immigration_status">
            <Col componentClass={ControlLabel} sm={3}>
              Immigration Status
            </Col>
            <Col sm={9}>
              <FormControl componentClass="select" placeholder="select">
                <option value="select">-- Not Set --</option>
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="postal_code">
            <Col componentClass={ControlLabel} sm={3}>
              Postal Code
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" />
            </Col>
          </FormGroup>

          <FormGroup controlId="registration_date">
            <Col componentClass={ControlLabel} sm={3}>
              Registration Date
            </Col>
            <Col sm={9}>
              <FormControl type="date" />
            </Col>
          </FormGroup>

          <FormGroup controlId="registration_status">
            <Col componentClass={ControlLabel} sm={3}>
              Registration Status
            </Col>
            <Col sm={9}>
              <FormControl componentClass="select" placeholder="select">
                <option value="select">-- Not Set --</option>
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="site_name">
            <Col componentClass={ControlLabel} sm={3}>
              Site Name
            </Col>
            <Col sm={9}>
              <FormControl type="text" defaultValue="" />
            </Col>
          </FormGroup>

          <FormGroup controlId="comments">
            <Col componentClass={ControlLabel} sm={3}>
              Comments
            </Col>
            <Col sm={9}>
              <FormControl componentClass="textarea" />
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
