import React, { Component } from 'react';
import TableRow from '../shared/TableRow'

// redux
import { connect } from 'react-redux'
import { fetchUser } from '../../store/actions/userActions.js'

import { Table } from 'react-bootstrap';

class User extends Component {
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
              <TableRow
                title="First Name"
                value={user.first_name}
              />
              <TableRow
                title="Last Name"
                value={user.last_name}
              />
              <TableRow
                title="Username"
                value={user.username}
              />
              <TableRow
                title="Email"
                value={user.email}
              />
              <TableRow
                title="Role"
                value={user.is_superuser ? 'Admin' : 'User'}
              />
              <TableRow
                title="Phone Number"
                value={user.primary_phone_number}
              />
              <TableRow
                title="Alternative Phone Number"
                value={user.alt_phone_number}
              />
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
