import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ServicesIndex from './services/ServicesIndex.js'
import ServiceRow from './services/ServiceRow.js'

// redux
import { connect } from 'react-redux'
import { fetchClients } from '../store/actions/serviceActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Services extends Component {
  componentWillMount() {
    this.props.dispatch(fetchClients());
  }

  render() {
    const p = this.props;
    return(
      <div className='clients-table content'>
        <div>
          <h1>Services</h1>
          <Link to='/services/new'>
            <Button bsStyle="default">
              Add new service
            </Button>
          </Link>
          <hr/>
          { p.clientsLoaded &&
            <ServicesIndex>{
              _.map(p.clients, (client) => {
                return <ServiceRow key={ client.id } client={ client } />
              })
            }</ServicesIndex>
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
)(Services);
