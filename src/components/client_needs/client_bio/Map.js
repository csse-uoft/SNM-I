import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { parsePointCoordinates } from '../../../util.js';


export default class ClientBio extends Component {
  render() {
    const
    coordinates = parsePointCoordinates(this.props.location.geometry.coordinates),
    GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={12}
        defaultCenter={coordinates} >
          <Marker position={coordinates} />
      </GoogleMap>
    ));
    return (
      <div style={{width: '100%', height: '190px'}}>
        <GMap
          containerElement={
            <div style={{ height: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
        />
      </div>
    );
  }
}