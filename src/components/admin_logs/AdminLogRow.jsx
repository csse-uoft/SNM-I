import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class AdminLogRow extends Component {
  render() {
    const log = this.props.log;

    return(
      <tr>
        <td>{log.action_time}</td>
        <td>
          <Link to={`/user/${log.user.id}`}>
            {log.user.first_name} {log.user.last_name}
          </Link>
        </td>
        <td>
          {log.action}&nbsp;
          <Link to={`/client/${log.object_id}`}>
            {log.object_name}
          </Link>
        </td>
        <td>
          {log.change_message}
        </td>
      </tr>
    )
  }
}
