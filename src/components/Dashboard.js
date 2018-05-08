import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchDashboardClientData } from '../store/actions.js'
import ClientNeedsOverview from './dashboard/ClientNeedsOverview.js'
import _ from 'lodash'
import '../stylesheets/Dashboard.css';

class Dashboard extends Component {

  render() {
    const p = this.props;
    return(
      <div>
        <div className='dashboard content'>
          <h3 className='title'>Recently Active Clients</h3>
          { p.clientDataLoaded &&
            <ClientNeedsOverview clients={p.clients} />
          }
        </div>
        <div className='footer'>
          <h5>
            <a href='http://csse.utoronto.ca/' target='_blank'>
              Centre for Social Services Engineering
            </a>, University of Toronto
          </h5>
        </div>
      </div>
    )
  }

  componentWillMount() {
    this.props.dispatch(fetchDashboardClientData());
  }
}

const mapStateToProps = (state) => {
  return {
    clients: state.clients.dashboard.index,
    clientDataLoaded: state.clients.dashboard.loaded
  }
}

export default connect(
  mapStateToProps
)(Dashboard);