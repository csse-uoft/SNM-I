import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import timeago from 'timeago.js'

export default class ClientOverviewRow extends Component {
  render() {
    const c = this.props.client;
    return(
      <tr>
        <td>
          <Link to={`/client/${c.id}`}>
            {c.first_name} {c.last_name}
          </Link>
        </td>
        <td className='centered-text'>
          {c.needs_without_matching_resources_count}</td>
        <td className='centered-text'>
          {c.needs_with_matching_resources_count}</td>
        <td className='centered-text'>
          {c.pending_needs_count}</td>
        <td className='centered-text'>
          {c.fulfilled_needs_count}</td>
        <td className='centered-text'>{this.recentActivityDateStr()}</td>
      </tr>
    )
  }

  recentActivityDateStr() {
    const jsonDate = this.props.client.most_recent_match_activity_datetime;
    let str;

    if (jsonDate) {
      let date = new Date(jsonDate);
      str = timeago().format(date);
    } else {
      str = 'n/a'
    }
    return str;
  }
}