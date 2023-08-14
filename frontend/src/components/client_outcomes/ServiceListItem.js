import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';
import { formatLocation } from '../../helpers/location_helpers'

import { connect } from 'react-redux'
import { ListGroupItem, Row, Col, Button } from 'react-bootstrap';
import { matchClientOutcome } from '../../store/actions/outcomeActions.js'
import { Typography } from "@mui/material";

class ServiceListItem extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(outcomeId, serviceId) {
    const form = {
      service_id: serviceId
    }
    this.props.dispatch(
      matchClientOutcome(outcomeId, form)
    );
  }

  render() {
    const service = this.props.service,
          outcomeId = this.props.outcomeId,
          label = this.props.label;

    return (
      <ListGroupItem className="recommended-service">
        <Row>
          <Col sm={8}>
            <h5>{label}.</h5>
            <Link to={`/service/${service.id}`}>
              <h5>{service.name}</h5>
            </Link>
            <Typography>{service.category}</Typography>
            {' '}
            <Typography>{Math.round(service.distance * 100) / 100} km</Typography>
            <p>{service.desc}</p>
            <p>{formatLocation(service.location)}</p>
          </Col>
          <Col sm={4}>
            <h5>Provider</h5>
            <Typography color="primary">{service.provider.type}</Typography>
            <Link to={`/provider/${service.provider.id}`}>
              { (service.provider.type === "Individual") ? (
                  <p>{`${service.provider.profile.first_name} ${service.provider.profile.last_name}`}</p>
                ) : (
                  <p>{service.provider.company}</p>
                )
              }
            </Link>
          </Col>
          <Col sm={12}>
            <Button bsStyle="default" onClick={e => this.submit(outcomeId, service.id)}>
              Select
            </Button>
          </Col>
        </Row>
      </ListGroupItem>
    )
  }
}

export default connect()(withRouter(ServiceListItem));
