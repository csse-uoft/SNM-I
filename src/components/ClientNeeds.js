import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import NeedsIndex from './client_needs/NeedsIndex'

import { Table, Button, Glyphicon } from 'react-bootstrap';

import '../stylesheets/ClientNeeds.css';

class ClientNeeds extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const p = this.props,
          clientId = p.clientId;
    return(
      <div>
        <h3>Needs</h3>
        <Link to={`/clients/${clientId}/needs/new`}>
          <Button bsStyle="default">
            Add need
          </Button>
        </Link>
        <hr />
        <NeedsIndex needs={p.needs}/>
      </div>
    )
  }
}

export default ClientNeeds;
