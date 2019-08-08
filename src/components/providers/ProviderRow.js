import React, { Component } from 'react';
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatPhoneNumber } from '../../helpers/phone_number_helpers'
import DropdownMenu from '../shared/DropdownMenu'

// redux
import { connect } from 'react-redux';
import { deleteProvider } from '../../store/actions/providerActions.js'
import { formatLocation } from '../../helpers/location_helpers.js'

class ProviderRow extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    console.log("this.props: ", this);
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
            {p.type==="Individual"
            ? p.profile && p.profile.first_name + " " + p.profile.last_name 
            : p.company}
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
            <MenuItem eventKey="1"
            href={`/provider/${p.id}`}
            target="_blank"
          >
            View
            <Glyphicon glyph="file" />
            </MenuItem>
            <EditButton currentUser={currentUser} providerStatus={p.status} url={url}/>
            <MenuItem divider />
            <MenuItem
              eventKey="3"
              onClick={() => this.props.handleShow(p.id)}>
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
  console.log("------------------>edit");
  if (providerStatus === 'Home Agency' && currentUser && !currentUser.is_admin) {
    return (
      <MenuItem eventKey="2" disabled 
      target="_blank">
        Edit
        <Glyphicon glyph="pencil" />
      </MenuItem>
    )
  }
  return (
    <MenuItem eventKey="2" href={url}
    target="_blank">
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
