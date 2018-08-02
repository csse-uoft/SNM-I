import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class AdminLogRow extends Component {
  render() {
    const log = this.props.log;

    function object_url(contentType, objectId) {
      if (contentType === 'Person') {
        contentType = 'Client'
      }
      return `/${contentType.toLowerCase()}s/${objectId}`
    }

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
          <Link to={object_url(log.object_repr, log.object_id)}>
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
