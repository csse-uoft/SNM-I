import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ClientsIndex from './clients/ClientsIndex.js'
import ClientRow from './clients/ClientRow.js'

// redux
import { connect } from 'react-redux'
import { fetchClients } from '../store/actions/clientActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Clients extends Component {
  componentWillMount() {
    this.props.dispatch(fetchClients());
  }

  render() {
    const p = this.props;
    return(
      <div className='clients-table content'>
        <div>
          <h1>Clients</h1>
          <Link to='/clients/new'>
            <Button bsStyle="default">
              Add new named client profile
            </Button>
          </Link>
          <Link to={`/clients/anonymous/new`}>
            <Button bsStyle="default">
              Add new anonymous client profile
            </Button>
          </Link>
          <hr/>
          { p.clientsLoaded &&
            <ClientsIndex>{
              _.map(p.clients, (client) => {
                return <ClientRow key={ client.id } client={ client } />
              })
            }</ClientsIndex>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    clients: state.clients.byId,
    clientsLoaded: state.clients.clientsLoaded
  }
}

export default connect(
  mapStateToProps
)(Clients);
