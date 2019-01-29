import _ from 'lodash';
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { ACTION_ERROR } from '../store/defaults.js'

import UsersIndex from './users/UsersIndex'
import UserRow from './users/UserRow'
import DeleteModal from './shared/DeleteModal'

// redux
import { connect } from 'react-redux'
import { fetchUsers, deleteUser } from '../store/actions/userActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.scss';

class Users extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      deleteModalShow: false,
      objectId: null,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchUsers());
  }

  handleDeleteModalHide() {
    this.setState({ deleteModalShow: false });
  }

  handleDeleteModalShow(id) {
    this.setState({
      deleteModalShow: true,
      objectId: id
    })
  }

  handleDelete(id, form) {
    this.props.dispatch(
      deleteUser(id, form, (status) => {
        if (status === ACTION_ERROR) {
          // this.setState({ displayError: true });
        } else {
          this.setState({ deleteModalShow: false })
        }
      })
    );
  }

  render() {
    const p = this.props;
    return (
      <div className="users-table content">
        <div>
          <h1>Users</h1>
          <Link to="/users/new">
            <Button bsStyle="default">
              Create new user
            </Button>
          </Link>
          <hr/>
          { p.usersLoaded &&
            <UsersIndex>{
              _.map(p.usersById, (user) => {
                return (
                  <UserRow
                    key={user.id}
                    user={user}
                    handleShow={this.handleDeleteModalShow}
                  />
                );
              })
            }</UsersIndex>
          }
        </div>
        <DeleteModal
          contentType="User"
          objectId={this.state.objectId}
          show={this.state.deleteModalShow}
          onHide={this.handleDeleteModalHide}
          delete={this.handleDelete}
        />
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
