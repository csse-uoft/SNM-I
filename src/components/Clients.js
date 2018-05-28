import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import ClientsIndex from './clients/ClientsIndex.js'
import ClientRow from './clients/ClientRow.js'

// redux
import { connect } from 'react-redux'
import { fetchClients, createClient, updateClient, deleteClient } from '../store/actions/clientActions.js'

// styles
import { Table, Button, Glyphicon } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Clients extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchClients());
  }

  render() {
    const p = this.props;
    return(
      <div className='clients-table content'>
        <div>
          <h1>Clients</h1>
          <Link to={{ pathname: '/clients/new', state: { foo: 'bar'} }}>
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
              p.clients.map((client) => {
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
    clients: state.clients.index,
    clientsLoaded: state.clients.indexLoaded
  }
}

export default connect(
  mapStateToProps
)(Clients);
