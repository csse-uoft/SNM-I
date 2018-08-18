import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import TableRow from '../shared/TableRow'
import ClientNeeds from '../ClientNeeds';
import NeedGroupPanel from '../client_needs/NeedGroupPanel';

// redux
import { connect } from 'react-redux'
import { fetchClient } from '../../store/actions/clientActions.js'
import { clientFields } from '../../constants/client_fields.js'

import { formatLocation } from '../../helpers/location_helpers'
import { formatPhoneNumber } from '../../helpers/phone_number_helpers'

import { Table, Label, Glyphicon, Button } from 'react-bootstrap';

class ClientInfoTable extends Component {
  render() {
    const client = this.props.client;
    const infoRows = this.props.infoFields.map(infoField => {
      if (infoField !== "family") {
        if (infoField === "primary_phone_number" || infoField === "alt_phone_number") {
          return (
            <TableRow
              key={infoField}
              title={clientFields[infoField].label}
              value={client[infoField] ? formatPhoneNumber(client[infoField]) : "None provided"}
            />
          );
        } else if (infoField === "address") {
          return (
            <TableRow
              key={infoField}
              title={clientFields[infoField].label}
              value={client[infoField] ? formatLocation(client.address) : "None provided"}
            />
          );
        } else if (infoField === "has_children") {
          return (
            <TableRow
              key={infoField}
              title={clientFields[infoField].label}
              value={client[infoField] ? 'Yes' : 'No'}
            />
          );
        } else if (infoField === "other_languages" || infoField === "eligibilities") {
          return (
            <TableRow
              key={infoField}
              title={clientFields[infoField].label}
              value={(client[infoField] || []).join(', ')}
            />
          );
        } else {
          return (
            <TableRow
              key={infoField}
              title={clientFields[infoField].label}
              value={client[infoField]}
            />
            );
          }
        }
      }
    );

    return (
      <Table bordered condensed className="client-profile-table">
        <tbody>
          <tr>
            <td colSpan="2"><b>{this.props.step} </b></td>
          </tr>
          {infoRows}
        </tbody>
      </Table>
    )
  }
}

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
    let needGroups;
    if (p.needsByNeedGroup) {
      needGroups = p.needsByNeedGroup.map(need_group =>
        <NeedGroupPanel
          key={need_group.id}
          needGroup={need_group.category}
          needs={need_group.needs}
          needGroupId={need_group.id}
          status={need_group.status}
          clientId={client.id}
        />
      );
    }
    const infoTables = [];
    Object.keys(this.props.formStructure).forEach( step =>
      infoTables.push(
        <ClientInfoTable
          key={step}
          clientId={id}
          client={client}
          step={step}
          infoFields={Object.keys(this.props.formStructure[step])}
        />)
    )
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
            {infoTables}

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
          </div>
        }
        <hr />
        { client && client.loaded && p.needsLoaded &&
          <div>
          <ClientNeeds
            clientId={client.id}
            needGroups={this.props.needsByNeedGroup}
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
    needsByNeedGroup: state.needs.needGroups,
    needsLoaded: state.needs.loaded,
    clientsById: state.clients.byId,
    clientLoaded: state.clients.indexLoaded,
    formStructure: state.settings.formStructure
  }
}

export default connect(
  mapStateToProps
)(Client);
