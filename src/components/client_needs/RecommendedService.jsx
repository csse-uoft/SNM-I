import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { formatLocation } from '../../helpers/location_helpers'
import _ from 'lodash';

import { connect } from 'react-redux'
import { ListGroupItem, Label, Row, Col, Button, Form, FormGroup } from 'react-bootstrap';
import { matchClientNeed } from '../../store/actions/needActions.js'

class RecommendedService extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit() {
    this.props.dispatch(matchClientNeed(this.props.need.client_id, this.props.need.id, this.props.service.id));
  }

  render() {

    const service = this.props.service;
    const need = this.props.need;

    return (
      <ListGroupItem className="recommended-service">
        <Row>
          <Col sm={8}>
            <Link to={`/service/${service.id}`}>
              <h5>{service.name}</h5>
            </Link>  
            <Label>{service.category}</Label>
            <p>{service.desc}</p>
            <p>{formatLocation(service.location)}</p>
          </Col>
          <Col>
            <h5>Provider</h5>
            <Label bsStyle="primary">{service.provider.provider_type}</Label>
            <Link to={`/provider/${service.provider.id}`}>
              { (service.provider.provider_type === "Individual") ? (
                  <p>{`${service.provider.first_name} ${service.provider.last_name}`}</p>
                ) : (
                  <p>{service.provider.company}</p>
                )
              }
            </Link>
            <Form horizontal>
            <FormGroup>
                <Col smOffset={3} sm={9}>
                  <Button onClick={this.submit}>
                    Match
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    )
  }
}

export default connect()(withRouter(RecommendedService));