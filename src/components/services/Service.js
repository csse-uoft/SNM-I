import React, { Component } from 'react';

// redux
import { connect } from 'react-redux'
import { fetchService } from '../../store/actions/serviceActions.js'

import { Table } from 'react-bootstrap';

class Service extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchService(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.id,
          service = p.servicesById[id];

    function getPhoneNumber(phoneNumbers, phoneType) {
      let matchedNumber = null
      phoneNumbers.forEach(function(phoneNumber) {
        if (phoneNumber.phone_type === phoneType) {
          matchedNumber = phoneNumber.phone_number
        }
      });
      return matchedNumber
    }

    return (
      <div className="content">
        <h3>Service Profile</h3>
        { service && service.loaded &&
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td><b>Name</b></td>
                <td>{service.name}</td>
              </tr>
              <tr>
                <td><b>Description</b></td>
                <td>{service.desc}</td>
              </tr>
              <tr>
                <td><b>Category</b></td>
                <td>{service.category}</td>
              </tr>
              <tr>
                <td><b>Language</b></td>
                <td>{service.language}</td>
              </tr>
              <tr>
                <td><b>Capacity</b></td>
                <td>{service.capacity}</td>
              </tr>
              <tr>
                <td><b>Email</b></td>
                <td>{service.email}</td>
              </tr>
              <tr>
                <td><b>Cell Phone</b></td>
                <td>{(service.phone_numbers.length > 0) ? getPhoneNumber(service.phone_numbers, 'mobile') : null}</td>
              </tr>
              <tr>
                <td><b>Main Phone</b></td>
                <td>{(service.phone_numbers.length > 0) ? getPhoneNumber(service.phone_numbers, 'home') : null}</td>
              </tr>
              <tr>
                <td><b>Address</b></td>
                <td>{(service.locations.length > 0) ? service.locations[0].properties.address : null}</td>
              </tr>
            </tbody>
          </Table>
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    servicesById: state.services.byId,
    serviceLoaded: state.services.indexLoaded 
  }  
}

export default connect(
  mapStateToProps
)(Service);
