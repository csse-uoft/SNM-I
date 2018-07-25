import React, { Component } from 'react';
import _ from 'lodash';

import ClientNeeds from '../ClientNeeds';

// redux
import { connect } from 'react-redux'
import { fetchClient } from '../../store/actions/clientActions.js'

import { formatLocation } from '../../helpers/location_helpers'

import { Table, Label, Glyphicon, Button } from 'react-bootstrap';

class Client extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchClient(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.id,
          client = p.clientsById[id];

    function TableRow({ title, value }) {
      if (value) {
        return (
          <tr>
            <td><b>{title}</b></td>
            <td>{value}</td>
          </tr>
        );
      } else {
        return null;
      }
    }

    return (
      <div className="content client">
        <h3>Client Profile</h3>
        <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
          <Glyphicon glyph="print" />
        </Button>
        { client && client.loaded &&
          <div>
            { client.is_deleted &&
              <h4>
                <Label bsStyle="danger">deleted</Label>
              </h4>
            }
            <Table bordered condensed className="client-profile-table">
              <tbody>
                <tr>
                  <td colSpan="2"><b>Personal Information: </b></td>
                </tr>
                <TableRow
                  title="First Name"
                  value={client.personal_information.first_name}
                />
                <TableRow
                  title="Middle Name"
                  value={client.personal_information.middle_name}
                />
                <TableRow
                  title="Last Name"
                  value={client.personal_information.last_name}
                />
                <TableRow
                  title="Preferred Name"
                  value={client.personal_information.preferred_name}
                />
                <TableRow
                  title="Gender"
                  value={client.personal_information.gender}
                />
                <TableRow
                  title="Date of Birth"
                  value={client.personal_information.birth_date}
                />
                <TableRow
                  title="Email"
                  value={client.personal_information.email}
                />
                <TableRow
                  title="Phone Number"
                  value={client.personal_information.primary_phone_number}
                />
                <TableRow
                  title="Alternative Phone Number"
                  value={client.personal_information.alt_phone_number}
                />
                <TableRow
                  title="Address"
                  value={formatLocation(client.personal_information.address)}
                />
              </tbody>
            </Table>
            <Table bordered condensed className="client-profile-table">
              <tbody>
                <tr>
                  <td colSpan="2"><b>Family: </b></td>
                </tr>
                {client.family &&
                  <TableRow
                    title="File ID"
                    value={client.family.file_id}
                  />
                }
                <TableRow
                  title="Marital Status"
                  value={client.personal_information.marital_status}
                />
                <TableRow
                  title="Has children?"
                  value={client.personal_information.has_children ? 'Yes' : 'No'}
                />
                {client.personal_information.has_children &&
                  <TableRow
                    title="Number of children"
                    value={client.personal_information.num_of_children}
                  />
                }
              </tbody>
            </Table>
            {(client.spouse || client.children) &&
              <Table bordered condensed className="client-profile-table">
                <tbody>
                  <tr>
                    <td colSpan="4"><b>Family Members: </b></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Full name</td>
                    <td>Date of birth</td>
                    <td>Gender</td>
                  </tr>
                  {client.spouse &&
                    (<tr>
                      <td><b>Spouse</b></td>
                      <td>{client.spouse.full_name}</td>
                      <td>{client.spouse.birth_date}</td>
                      <td>{client.spouse.gender}</td>
                    </tr>)
                  }
                  {_.map(client.children, (child, index) => {
                    return (
                      <tr key={child.id}>
                        <td><b>Children #{index+1}</b></td>
                        <td>{child.full_name}</td>
                        <td>{child.birth_date}</td>
                        <td>{child.gender}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            }
            <Table bordered condensed className="client-profile-table">
              <tbody>
                <tr>
                  <td colSpan="2"><b>Background Information: </b></td>
                </tr>
                <TableRow
                  title="Status in Canada"
                  value={client.status_in_canada}
                />
                <TableRow
                  title="Country of Origin"
                  value={client.country_of_origin}
                />
                <TableRow
                  title="Country of Last Residence"
                  value={client.country_of_last_residence}
                />
                <TableRow
                  title="First Language"
                  value={client.first_language}
                />
                <TableRow
                  title="Other Language(s) spoken"
                  value={(client.other_languages || []).join(', ')}
                />
                <TableRow
                  title="Permanent Residence Card Number (PR card)"
                  value={client.pr_number}
                />
                <TableRow
                  title="Immigration Document Number"
                  value={client.immigration_doc_number}
                />
                <TableRow
                  title="Landing Date"
                  value={client.landing_date}
                />
                <TableRow
                  title="Arrival Date"
                  value={client.arrival_date}
                />
                <TableRow
                  title="Level of Education"
                  value={client.level_of_education}
                />
                <TableRow
                  title="Income Source"
                  value={client.immigration_doc_number}
                />
                <TableRow
                  title="Number of Dependants"
                  value={client.num_of_dependants}
                />
              </tbody>
            </Table>
          </div>
        }
        <hr />
        { client && client.loaded && p.needsLoaded &&
          <ClientNeeds clientId={client.id} needs={p.needsById} needsOrder={p.needsOrder} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    needsById: state.needs.byId,
    needsOrder: state.needs.order,
    needsLoaded: state.needs.loaded,
    clientsById: state.clients.byId,
    clientLoaded: state.clients.indexLoaded
  }
}

export default connect(
  mapStateToProps
)(Client);
