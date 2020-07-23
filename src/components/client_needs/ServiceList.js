import React from 'react';
import _ from 'lodash';

import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import ServiceListItem from './ServiceListItem';

import { Row, Col } from 'react-bootstrap';


const GMap = withGoogleMap(props => (
  <GoogleMap
    zoom={10}
    center={props.latlng}>
    {_.map(props.services, (service, index) => {
      return (
        <Marker
          key={service.id}
          label={(index+1).toString()}
          position={{ lat: parseFloat(service.location.lat), lng: parseFloat(service.location.lng)}}
        />
      )
    })}
  </GoogleMap>
));

export default function ServiceList({ need, services, latlng }) {
  return (
    <Row>
      <Col sm={8}>
        {_.map(services, (service, index) => {
          return (
            <ServiceListItem
              key={service.id}
              needId={need.id}
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
