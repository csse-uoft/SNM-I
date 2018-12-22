import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ClientNeeds from '../ClientNeeds';
import ClientInfoTable from './client_table/ClientInfoTable';
import NeedGroupPanel from '../client_needs/NeedGroupPanel';
import ServiceRow from '../services/ServiceRow';
import ProviderRow from '../providers/ProviderRow';

// redux
import { connect } from 'react-redux'
import { fetchClient } from '../../store/actions/clientActions.js'
import { clientFields } from '../../constants/client_fields.js'

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
    let services = {},
        providers = {};
    _.each(client.need_groups, need_group => {
      _.each(need_group.needs, need => {
        _.each(need.matches, match => {
          if (!services[match.service.id]) {
            services[match.service.id] = match.service;
          }
          if (!providers[match.service.provider.id]) {
            providers[match.service.provider.id] = match.service.provider;
          }
        })
      })
    })
    services = Object.values(services)
    providers = Object.values(providers)

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
        {client && client.loaded &&
          <div>
            {client.is_deleted &&
              <h4>
                <Label bsStyle="danger">deleted</Label>
              </h4>
            }
            {_.map(this.props.formStructure, (infoFields, step) => {
              return (
                <ClientInfoTable
                  key={step}
                  step={step}
                  client={client}
                  clientFields={clientFields}
                  infoFields={_.keys(_.omit(infoFields, 'family'))}
                />
              )
            })}
            {(client.family && client.family.members.length > 0) &&
              <Table bordered condensed className="profile-table">
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
                  {_.map(_.filter(client.family.members, member => {
                    return member.person.id !== client.id
                  }), (member, index) => {
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
                  })}
                </tbody>
              </Table>
            }
          </div>
        }
        <hr />
        { client && client.loaded && p.needsLoaded &&
          <ClientNeeds
            clientId={client.id}
            needGroups={this.props.needsByNeedGroup}
            needsOrder={p.needsOrder}
          />
        }
        <hr />
        <h3>Services for Client</h3>
        { client && client.loaded && p.needsLoaded &&
          <Table className="dashboard-table" striped bordered condensed hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Provider</th>
                <th>Description</th>
                <th>Category</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                return <ServiceRow key={ service.id } service={ service }/>
              })}
            </tbody>
          </Table>
        }
        <hr />
        <h3>Providers for Client</h3>
        { client && client.loaded && p.needsLoaded && providers.length > 0 &&
          <Table className="dashboard-table" striped bordered condensed hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {providers.map(provider => {
                return <ProviderRow key={provider.id} provider={provider} />
              })}
            </tbody>
          </Table>
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
    formStructure: state.settings.clients.formStructure
  }
}

export default connect(
  mapStateToProps
)(Client);
