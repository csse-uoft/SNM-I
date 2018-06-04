import React, { Component } from 'react';

// redux
import { connect } from 'react-redux'
import { fetchService } from '../../store/actions/serviceActions.js'

import { formatLocation } from '../../helpers/location_helpers'

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
                <td><b>Contact Person Email</b></td>
                <td>{service.email}</td>
              </tr>
              <tr>
                <td><b>Contact Person Phone</b></td>
                <td>{service.primary_phone_number}</td>
              </tr>
              <tr>
                <td><b>Secondary Phone</b></td>
                <td>{service.alt_phone_number}</td>
              </tr>
              <tr>
                <td><b>Location</b></td>
                <td>{formatLocation(service.location)}</td>
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
