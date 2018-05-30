import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import NeedsIndex from './client_needs/NeedsIndex'

import { Button } from 'react-bootstrap';

import '../stylesheets/ClientNeeds.css';

class ClientNeeds extends Component {
  render() {
    const p = this.props,
          clientId = p.clientId;
    return (
      <div>
        <h3>Needs</h3>
        <Link to={`/clients/${clientId}/needs/new`}>
          <Button bsStyle="default">
            Add need
          </Button>
        </Link>
        <hr />
        <NeedsIndex needs={p.needs} clientId={p.clientId} />
      </div>
    )
  }
}

export default ClientNeeds;
