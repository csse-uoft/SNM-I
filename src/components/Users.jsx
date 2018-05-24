import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import UsersIndex from './users/UsersIndex'
import UserRow from './users/UserRow'

// redux
import { connect } from 'react-redux'
import { fetchUsers, createUser, updateUser, deleteUser } from '../store/actions/userActions.js'

// styles
import { Table, Button, Glyphicon } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchUsers());
  }

  render() {
    const p = this.props;
    return(
      <div className='users-table content'>
        <div>
          <h1>Users</h1>
          <Link to={`/users/new`}>
            <Button bsStyle="default">
              Create new user
            </Button>
          </Link>
          <hr/>
          { p.usersLoaded &&
            <UsersIndex>{
              p.users.map((user) => {
                return <UserRow key={ user.id } user={ user } />
              })
            }</UsersIndex>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users.index,
    usersLoaded: state.users.indexLoaded
  }
}

export default connect(
  mapStateToProps
)(Users);
