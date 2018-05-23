import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux'
import { fetchClient } from '../../store/actions.js'

import { Table, Button, Glyphicon } from 'react-bootstrap';

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
                <td>123-456-789</td>
              </tr>
              <tr>
                <td><b>Home Phone</b></td>
                <td>123-456-789</td>
              </tr>
              <tr>
                <td><b>Address</b></td>
                <td>27 Kings College Circle Toronto, Ontario M5S 1A1 Canada</td>
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
        <h3>Needs</h3>
        <Link to="/needs/new">
          <Button bsStyle="default">
            Add need
          </Button>
        </Link>
        <hr />
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <Link to="/client/1">
                  Food
                </Link>
              </td>
              <td>Baby food</td>
              <td>Unfulfilled</td>
              <td>
                <Link to="/clients/edit">
                  <Button bsStyle="primary">
                    <Glyphicon glyph="edit" />
                  </Button>
                </Link>
              </td>
              <td>
                <Button bsStyle="danger">
                  <Glyphicon glyph="trash" />
                </Button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <Link to="/client/2">
                  Language
                </Link>
              </td>
              <td>Klingon</td>
              <td>Unfulfilled</td>
              <td>
                <Button bsStyle="primary">
                  <Glyphicon glyph="edit" />
                </Button>
              </td>
              <td>
                <Button bsStyle="danger">
                  <Glyphicon glyph="trash" />
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>  
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    clientsById: state.clients.byId,
    clientLoaded: state.clients.indexLoaded 
  }  
}

export default connect(
  mapStateToProps  
)(Client);
