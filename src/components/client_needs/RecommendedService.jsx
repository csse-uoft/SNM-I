import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { formatLocation } from '../../helpers/location_helpers'
import _ from 'lodash';

import { ListGroupItem, Label, Row, Col } from 'react-bootstrap';

export default class RecommendedService extends Component {
  render() {

    const service = this.props.service;
    debugger
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
          </Col>
        </Row>
      </ListGroupItem>
    )
  }
}
