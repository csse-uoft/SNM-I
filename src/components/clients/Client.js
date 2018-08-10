import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import TableRow from '../shared/TableRow'
import ClientNeeds from '../ClientNeeds';
import NeedGroupPanel from '../client_needs/NeedGroupPanel';

// redux
import { connect } from 'react-redux'
import { fetchClient } from '../../store/actions/clientActions.js'

import { formatLocation } from '../../helpers/location_helpers'
import { formatPhoneNumber } from '../../helpers/phone_number_helpers'

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
    if (client.family) {
      let members = _.clone(client.family.members);
       _.remove(members, {
        person: { id: id }
      });
    }
    console.log(client)
    const needGroups = client.need_groups.map(need_group =>
      <NeedGroupPanel
        needGroup={need_group.category}
        needs={need_group.needs}
        needGroupId={need_group.id}
        status={need_group.status}
        clientId={client.id}
      />
    );

    return (
      <div className="content client">
        <h3>Client Profile</h3>
        <Link to={`/clients/${client.id}/edit`}>
          <Button bsStyle="primary">
            Edit
          </Button>
        </Link>{' '}
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
                  title="File ID"
                  value={client.file_id}
                />
                <TableRow
                  title="First Name"
                  value={client.first_name}
                />
                <TableRow
                  title="Middle Name"
                  value={client.middle_name}
                />
                <TableRow
                  title="Last Name"
                  value={client.last_name}
                />
                <TableRow
                  title="Preferred Name"
                  value={client.preferred_name}
                />
                <TableRow
                  title="Gender"
                  value={client.gender}
                />
                <TableRow
                  title="Date of Birth"
                  value={client.birth_date}
                />
                <TableRow
                  title="Email"
                  value={client.email}
                />
                <TableRow
                  title="Phone Number"
                  value={client.primary_phone_number ? formatPhoneNumber(client.primary_phone_number) : "None provided"}
                />
                <TableRow
                  title="Alternative Phone Number"
                  value={client.alt_phone_number &&
                    formatPhoneNumber(client.alt_phone_number)}
                />
                <TableRow
                  title="Address"
                  value={client.address ? formatLocation(client.address) : "None provided"}
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
                  value={client.marital_status}
                />
                <TableRow
                  title="Has children?"
                  value={client.has_children ? 'Yes' : 'No'}
                />
                {client.has_children &&
                  <TableRow
                    title="Number of children"
                    value={client.num_of_children}
                  />
                }
              </tbody>
            </Table>
            {(client.family && client.family.members.length > 0) &&
              <Table bordered condensed className="client-profile-table">
                <tbody>
                  <tr>
                    <td colSpan="6"><b>Family Members: </b></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><b>First name</b></td>
                    <td><b>Last name</b></td>
                    <td><b>Date of birth</b></td>
                    <td><b>Gender</b></td>
                    <td><b>Relationship</b></td>
                  </tr>
                  {_.map(client.family.members, (member, index) => {
                    if (member.person.id === client.id) {
                      return null;
                    }
                    else {
                      return (
                        <tr key={member.person.id}>
                          <td><b>Family member #{index+1}</b></td>
                          <td>{member.person.first_name}</td>
                          <td>{member.person.last_name}</td>
                          <td>{member.person.birth_date}</td>
                          <td>{member.person.gender}</td>
                          <td>{member.relationship}</td>
                        </tr>
                      )
                    }
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
                  title="Current Education Level"
                  value={client.current_education_level}
                />
                <TableRow
                  title="Completed Education Level"
                  value={client.completed_education_level}
                />
                <TableRow
                  title="Income Source"
                  value={client.income_source}
                />
                <TableRow
                  title="Number of Dependants"
                  value={client.num_of_dependants}
                />
                <TableRow
                  title="Eligibilities"
                  value={(client.eligibilities || []).join(', ')}
                />
              </tbody>
            </Table>
          </div>
        }
        <hr />
        { client && client.loaded && p.needsLoaded &&
          <div>
          <ClientNeeds
            clientId={client.id}
            need_groups={client.need_groups}
            needsOrder={p.needsOrder}
          />
          </div>
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
