import React from 'react';
import _ from 'lodash';

// import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import GoogleMap from '../shared/GoogleMap'
import ServiceListItem from './ServiceListItem';

import { Row, Col } from 'react-bootstrap';


function GMap(props) {
  return <GoogleMap
    zoom={10}
    center={props.latlng}
    markers={props.services.map((service, idx) => {
      return {
        title: (idx + 1) + '',
        position: { lat: parseFloat(service.location.lat), lng: parseFloat(service.location.lng)}
      }
  })}/>
}

export default function ServiceList({ outcome, services, latlng }) {
  return (
    <Row>
      <Col sm={8}>
        {_.map(services, (service, index) => {
          return (
            <ServiceListItem
              key={service.id}
              outcomeId={outcome.id}
              label={index+1}
              service={service}
            />
          )
        })}
      </Col>
      <Col sm={4}>
        <div style={{ width: '100%', height: '400px' }}>
          <GMap
            containerElement={
              <div style={{ height: `100%` }} />
            }
            mapElement={
              <div style={{ height: `100%` }} />
            }
            latlng={latlng}
            services={services}
          />
        </div>
      </Col>
    </Row>
  )
}
