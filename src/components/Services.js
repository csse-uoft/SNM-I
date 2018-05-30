import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ServicesIndex from './services/ServicesIndex.js'
import ServiceRow from './services/ServiceRow.js'

// redux
import { connect } from 'react-redux'
import { fetchServices } from '../store/actions/serviceActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Services extends Component {
  componentWillMount() {
    this.props.dispatch(fetchServices());
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
          { p.servicesLoaded &&
            <ServicesIndex>{
              _.map(p.services, (service) => {
                return <ServiceRow key={ service.id } service={ service } />
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
    services: state.services.byId,
    servicesLoaded: state.services.servicesLoaded
  }
}

export default connect(
  mapStateToProps
)(Services);
