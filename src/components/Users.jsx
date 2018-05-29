import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import UsersIndex from './users/UsersIndex'
import UserRow from './users/UserRow'

// redux
import { connect } from 'react-redux'
import { fetchUsers } from '../store/actions/userActions.js'

// styles
import { Button } from 'react-bootstrap';
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
              _.map(p.usersById, (user) => {
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
    usersById: state.users.byId,
    usersLoaded: state.users.usersLoaded
  }
}

export default connect(
  mapStateToProps
)(Users);
