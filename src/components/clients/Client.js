import React, { Component } from 'react';

import ClientNeeds from '../ClientNeeds';

// redux
import { connect } from 'react-redux'
import { fetchClient } from '../../store/actions/clientActions.js'

import { Table } from 'react-bootstrap';

class Client extends Component {
  constructor(props) {  
    super(props);  
  }

  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchClient(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.id,
          client = p.clientsById[id];

    function getPhoneNumber(phoneNumbers, phoneType) {
      let matchedNumber = null
      phoneNumbers.forEach(function(phoneNumber) {
        if (phoneNumber.phone_type == phoneType) {
          matchedNumber = phoneNumber.phone_number
        }
      });
      return matchedNumber
    }

    return (
      <div className="content">
        <h3>Client Profile</h3>
        { client && client.loaded &&
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td><b>First Name</b></td>
                <td>{client.first_name}</td>
              </tr>
              <tr>
                <td><b>Last Name</b></td>
                <td>{client.last_name}</td>
              </tr>
              <tr>
                <td><b>Gender</b></td>
                <td>{client.gender}</td>
              </tr>
              <tr>
                <td><b>Preferred Name</b></td>
                <td>{client.preferred_name}</td>
              </tr>
              <tr>
                <td><b>Date of Birth</b></td>
                <td>{client.birth_date}</td>
              </tr>
              <tr>
                <td><b>Marital Status</b></td>
                <td>Single</td>
              </tr>
              <tr>
                <td><b>Email</b></td>
                <td>{client.email}</td>
              </tr>
              <tr>
                <td><b>Cell Phone</b></td>
                <td>{(client.phone_numbers.length > 0) ? getPhoneNumber(client.phone_numbers, 'mobile') : null}</td>
              </tr>
              <tr>
                <td><b>Home Phone</b></td>
                <td>{(client.phone_numbers.length > 0) ? getPhoneNumber(client.phone_numbers, 'home') : null}</td>
              </tr>
              <tr>
                <td><b>Address</b></td>
                <td>{(client.locations.length > 0) ? client.locations[0].properties.address : null}</td>
              </tr>
              {/*
              <tr>
                <td><b>Family Code</b></td>
                <td />
              </tr>
              <tr>
                <td><b>Landing Date</b></td>
                <td>2018-01-01</td>
              </tr>
              <tr>
                <td><b>Arrival Date</b></td>
                <td>2018-01-01</td>
              </tr>
              <tr>
                <td><b>Re-entry Date</b></td>
                <td>2018-01-03</td>
              </tr>
              <tr>
                <td><b>Initial Destination</b></td>
                <td>Toronto</td>
              </tr>
              <tr>
                <td><b>Country of Origin</b></td>
                <td>US</td>
              </tr>
              <tr>
                <td><b>Last Residence</b></td>
                <td>New York</td>
              </tr>
              <tr>
                <td><b>Immi. Class</b></td>
                <td />
              </tr>
              <tr>
                <td><b>Immi. Status</b></td>
                <td />
              </tr>
              <tr>
                <td><b>Immi. Card Type</b></td>
                <td />
              </tr>
              <tr>
                <td><b>Aboriginal Status</b></td>
                <td />
              </tr>
              <tr>
                <td><b>Preferred Official Language</b></td>
                <td>English</td>
              </tr>
              */}
            </tbody>
          </Table>
        }
        <hr />
        { p.needsLoaded &&
          <ClientNeeds clientId={client.id} needs={p.needsById} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    needsById: state.needs.byId,
    needsLoaded: state.needs.loaded,
    clientsById: state.clients.byId,
    clientLoaded: state.clients.indexLoaded 
  }  
}

export default connect(
  mapStateToProps
)(Client);
