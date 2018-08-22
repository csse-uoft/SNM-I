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

  submit(needId, serviceId) {
    const form = {
      service_id: serviceId
    }
    this.props.dispatch(
      matchClientNeed(needId, form)
    );
  }

  render() {
    const service = this.props.service,
          needId = this.props.needId,
          label = this.props.label;

    return (
      <ListGroupItem className="recommended-service">
        <Row>
          <Col sm={8}>
            <h5>{label}.</h5>
            <Link to={`/service/${service.id}`}>
              <h5>{service.name}</h5>
            </Link>
            <Label>{service.category}</Label>
            {' '}
            <Label>{Math.round(service.distance * 100) / 100} km</Label>
            <p>{service.desc}</p>
            <p>{formatLocation(service.location)}</p>
          </Col>
          <Col sm={4}>
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
          <Col sm={12}>
            <Button bsStyle="default" onClick={e => this.submit(needId, service.id)}>
              Select
            </Button>
          </Col>
        </Row>
      </ListGroupItem>
    )
  }
}

export default connect()(withRouter(RecommendedService));
