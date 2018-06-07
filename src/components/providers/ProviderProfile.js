import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import _ from 'lodash'

// components
import { formatLocation } from '../../helpers/location_helpers'

// styles
import { Table, Button, Row } from 'react-bootstrap'
import { fetchProvider } from '../../store/actions/providerActions.js'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom';

class ProviderProfile extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchProvider(id));
  }

  render() {
    const id = this.props.match.params.id;
    const provider = this.props.providersById[id];
    console.log(this.props)
    console.log(provider)

    return (
      <div className="content">
        <h3>Provider Profile</h3>

      { provider && provider.loaded &&
        <div>
         <Link to={`/provider/${id}/edit/${provider.provider_type.toLowerCase()}`}>
          <Button bsStyle="default">
            Edit
          </Button>
        </Link>
        &nbsp; 
        <Link to={`/provider/${id}/rate`}>
          <Button bsStyle="default">
            Rate Provider
          </Button>
        </Link>

        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <td><b>Type</b></td>
              <td>{provider.provider_type}</td>
            </tr>

            <tr>
              <td><b>Status</b></td>
              <td>{provider.status}</td>
            </tr>

          {provider.provider_type === "Organization" &&
            <tr>
              <td><b>Company Name</b></td>
              <td>{provider.company}</td>
            </tr>
          }

          <tr>
            <td><b>First Name</b></td>
            <td>{provider.first_name}</td>
          </tr>
          <tr>
            <td><b>Last Name</b></td>
            <td>{provider.last_name}</td>
          </tr>

          {provider.provider_type === "Individual" && provider.preferred_name.length > 0 && 
            <tr>
              <td><b>Preferred Name</b></td>
              <td>{provider.preferred_name}</td>
            </tr>
          }
          {provider.provider_type === "Individual" &&
            <tr> 
              <td><b>Gender</b></td>
              <td>{provider.gender}</td>
            </tr>
          }

          <tr>
            <td><b>Email</b></td>
            <td>{provider.email}</td>
          </tr>
          <tr>
            <td><b>Phone</b></td>
            <td>{provider.primary_phone_number}</td>
          </tr>

          {provider.primary_phone_extension !== '' &&
          <tr>
            <td><b>Extension</b></td>
            <td>{provider.primary_phone_extension}</td>
          </tr>
          }

          {provider.alt_phone_number !== '' &&
          <tr>
            <td><b>Alternate Phone Number</b></td>
            <td>{provider.alt_phone_number} </td>
          </tr>
          }

          <tr>
            <td><b>Address</b></td>
            <td>{formatLocation(provider.address)}</td>
          </tr>

          {provider.provider_type === "Individual" && provider.referrer.length > 0 &&
          <tr>
            <td><b>Referrer</b></td>
            <td>{provider.referrer}</td>
          </tr>
          }
          <tr>
            <td><b>Provider Reviews</b></td>
            <td>{
              <StarRatingComponent
              name="provider-rating"
              editing={false}
              starCount={5}
              value={4}
              />
            }
            </td>
          </tr>

         </tbody>
        </Table>
      </div>
    }
    <hr />
     <h3>Services</h3>
      <Link to="/services/new">
        <Button bsStyle="default">
          Add Service
        </Button>
      </Link>
    <hr />
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>Type</th>
          <th>Description</th>
          <th>Availability</th>
          <th />
          <th />
        </tr>
      </thead>
        <tbody>
        </tbody>
    </Table>
  </div>  
  );
  }
}

const mapStateToProps = (state) => {
  return { 
    providersById: state.providers.byId || {},
    providerLoaded: state.providers.indexLoaded
  } 
}

export default connect(
  mapStateToProps  
)(ProviderProfile);