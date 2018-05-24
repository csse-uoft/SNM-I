import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

// redux
import { connect } from 'react-redux'
import { deleteUser } from '../../store/actions/userActions.js'

class UserRow extends Component {
  constructor(props) {
    super(props);

    this.delete = this.delete.bind(this);
  }

  delete(id) {
    this.props.dispatch(deleteUser(id));
  }

  render() {
    const user = this.props.user;
    return(
      <tr>
        <td>{user.id}</td>
        <td>
          <Link to={`/user/${user.id}`}>
            {user.first_name} {user.last_name}
          </Link>
        </td>
        <td className='centered-text'>
          {user.email}
        </td>
        <td className='centered-text'>
          {user.is_superuser ? 'Admin' : 'User'}
        </td>
        <td>
          <Link to={{ pathname: `/users/${user.id}/edit`, state: { user: user } }}>
            <Button bsStyle="primary">
              <Glyphicon glyph="edit" />
            </Button>
          </Link>
        </td>
        <td>
          <Button bsStyle="danger" onClick={() => this.delete(user.id)}>
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}

export default connect()(UserRow);
