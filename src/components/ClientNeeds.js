import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchClient } from '../store/actions.js';
import _ from 'lodash';

import ClientBio from './client_needs/ClientBio.js';
import NeedsByStatus from './client_needs/NeedsByStatus.js';

import '../stylesheets/ClientNeeds.css';

class ClientNeeds extends Component {
  render() { 
    const p = this.props,
          clientId = p.match.params.id,
          client = p.clientsById[clientId];
    return(
      <div>
        {client && client.loaded &&
          <div className='client-needs'>
            <ClientBio client={client} />
            <NeedsByStatus />
          </div>
        }
      </div>
    )
  }

  componentWillMount() { 
    const clientId = this.props.match.params.id;
    this.props.dispatch(fetchClient(clientId));
  } 
}

const mapStateToProps = (state) => {
  return {
    clientsById: state.clients.byId
  }
}

export default connect(
  mapStateToProps
)(ClientNeeds);