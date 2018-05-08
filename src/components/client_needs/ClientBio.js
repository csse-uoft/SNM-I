import React, { Component } from 'react';
import Map from './client_bio/Map.js';
import _ from 'lodash';

export default class ClientBio extends Component {
  render() {
    const client = this.props.client;
    return (
      <div className='bio'>
        <h4>{client.first_name} {client.last_name}</h4>
        {this.hasBirthdate() &&
          <div>
            <p className='lbl'>Date of Birth</p>
            <p>{client.birthdate}</p>
          </div>
        }
        <p className='lbl'>Email</p>
        <p>{client.email}</p>
        {this.hasCellPhone() &&
          <div>
            <p className='lbl'>Cell Phone</p>
            <p>{client.cell_phone}</p>
          </div>
        }
        {this.hasHomePhone() &&
          <div>
            <p className='lbl'>Home Phone</p>
            <p>{client.home_phone}</p>
          </div>
        }
        {this.hasAddress() &&
          <div>
            <p className='lbl'>Address</p> 
            <p>{client.location.properties.address}</p>
          </div>
        }
        {this.hasCoordinates() &&
          <Map location={client.location} />
        }
      </div>
    );
  }

  hasBirthdate = () => {
    return !!this.props.client.birthdate
  };

  hasCellPhone = () => {
    return !_.isEmpty(_.trim(this.props.client.cell_phone))
  };

  hasHomePhone = () => {
    return !_.isEmpty(_.trim(this.props.client.home_phone))
  };

  hasCoordinates = () => {
    return this.props.client.location && this.props.client.location.geometry.coordinates;
  };

  hasAddress = () => {
    return this.props.client.location && this.props.client.location.properties.address;
  };
}