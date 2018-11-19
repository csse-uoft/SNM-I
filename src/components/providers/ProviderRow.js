import React, { Component } from 'react';
import { Glyphicon, Button, Dropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { deleteProvider } from '../../store/actions/providerActions.js'
import { formatLocation } from '../../helpers/location_helpers.js'

class ProviderRow extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }

  delete(id) {
    this.props.dispatch(deleteProvider(id));
  }

  render() {
    const p = this.props.provider;
    const currentUser = this.props.currentUser;
    const url = '/provider/' + p.id + '/edit/';

    return (
      <tr>
        <td>
          <Link to={`/provider/${p.id}`}>
            {p.type==="Individual" ? p.first_name + " " + p.last_name : p.company}
          </Link>
        </td>
        <td>
          {p.type}
        </td>
        <td className='centered-text'>
          {p.email}
        </td>
        <td className='centered-text'>
          {p.primary_phone_number}
        </td>
        <td className='centered-text'>
          {p.main_address && formatLocation(p.main_address)}
        </td>
        <td>
          <Dropdown
            id="dropdown-menu"
            className="vertical-options"
            pullRight
          >
          <Dropdown.Toggle noCaret>
            <Glyphicon glyph="option-vertical" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem eventKey="1" href={`/provider/${p.id}`}>
              View
              <Glyphicon glyph="file" />
            </MenuItem>
            <EditButton currentUser={currentUser} providerStatus={p.status} url={url}/>
            <MenuItem divider />
            <MenuItem
              eventKey="3"
              onClick={() => this.delete(p.id)}
              disabled={p.status === 'Home Agency'}>
              Delete
              <Glyphicon glyph="trash" />
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        </td>
      </tr>
    )
  }
}

function EditButton({ currentUser, providerStatus, url }) {
  if (providerStatus === 'Home Agency' && currentUser && !currentUser.is_admin) {
    return (
      <MenuItem eventKey="2" disabled>
        Edit
        <Glyphicon glyph="pencil" />
      </MenuItem>
    )
  }
  return (
    <MenuItem eventKey="2" href={url}>
      Edit
      <Glyphicon glyph="pencil" />
    </MenuItem>
  );
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser
  }
}

export default connect(mapStateToProps)(ProviderRow);
