import React from 'react';
import _ from 'lodash';

import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import RecommendedService from './RecommendedService';

import { Row, Col } from 'react-bootstrap';


const GMap = withGoogleMap(props => (
  <GoogleMap
    zoom={10}
    center={props.latlng}>
    {_.map(props.recommended_services, (service, index) => {
      return (
        <Marker
          key={service.id}
          label={(index+1).toString()}
          position={service.location.lat_lng}
        />
      )
    })}
  </GoogleMap>
));

export default function RecommendedServices({ need, recommended_services, latlng }) {
  return (
    <Row>
      <Col sm={8}>
        {_.map(recommended_services, (service, index) => {
          return (
            <RecommendedService
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
            recommended_services={recommended_services}
          />
        </div>
      </Col>
    </Row>
  )
}
