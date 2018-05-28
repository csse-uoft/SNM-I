import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux'
import { fetchUser } from '../../store/actions/userActions.js'

import { Table } from 'react-bootstrap';

class User extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    this.props.dispatch(fetchUser(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.id,
          user = p.usersById[id];

    return (
      <div className="content">
        <h3>User Profile</h3>
        { user && user.loaded &&
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td><b>First Name</b></td>
                <td>{user.first_name}</td>
              </tr>
              <tr>
                <td><b>Last Name</b></td>
                <td>{user.last_name}</td>
              </tr>
              <tr>
                <td><b>Username</b></td>
                <td>{user.username}</td>
              </tr>
              <tr>
                <td><b>Email</b></td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td><b>Role</b></td>
                <td>{user.is_superuser ? 'Admin' : 'User'}</td>
              </tr>
            </tbody>
          </Table>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    usersById: state.users.byId
  }
}

export default connect(
  mapStateToProps
)(User);
