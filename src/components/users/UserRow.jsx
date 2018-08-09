import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DropdownMenu from '../shared/DropdownMenu'

// redux
import { connect } from 'react-redux'
import { deleteUser } from '../../store/actions/userActions.js'

export default class UserRow extends Component {
  render() {
    const user = this.props.user;
    return(
      <tr>
        <td>
          <Link to={`/users/${user.id}`}>
            {user.first_name} {user.last_name}
          </Link>
        </td>
        <td>{user.email}</td>
        <td>
          {user.is_superuser ? 'Admin' : 'User'}
        </td>
        <td>
          <DropdownMenu
            urlPrefix="users"
            objectId={user.id}
            handleShow={this.props.handleShow}
          />
        </td>
      </tr>
    )
  }
}
