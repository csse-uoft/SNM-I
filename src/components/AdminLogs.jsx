import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import AdminLogsIndex from './admin_logs/AdminLogsIndex'
import AdminLogRow from './admin_logs/AdminLogRow'

// redux
import { connect } from 'react-redux'
import { fetchAdminLogs } from '../store/actions/adminLogActions.js'


class AdminLogs extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.props.dispatch(fetchAdminLogs());
  }

  render() {
    const p = this.props;
    return(
      <div className='clients-table content'>
        <div>
          <h1>AdminLogs</h1>
          <hr/>
          { p.logsLoaded &&
            <AdminLogsIndex>{
              _.map(p.logs, (log) => {
                return <AdminLogRow key={ log.id } log={ log } />
              })
            }</AdminLogsIndex>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    logs: state.admin_logs.byId,
    logsLoaded: state.admin_logs.logsLoaded
  }
}

export default connect(
  mapStateToProps
)(AdminLogs);
