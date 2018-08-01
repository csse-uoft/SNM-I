import React, { Component } from 'react';
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';
import { formatLocation } from '../../helpers/location_helpers'
import { formatPhoneNumber } from '../../helpers/phone_number_helpers'

class ClientRow extends Component {
  render() {
    const client = this.props.client;

    return (
      <tr>
        <td>{client.last_name}</td>
        <td>
          {client.first_name}
        </td>
        <td>
          {formatPhoneNumber(client.primary_phone_number)}
        </td>
        <td>
          {client.email}
        </td>
        <td>
          {formatLocation(client.address)}
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
            <MenuItem eventKey="1" href={`/clients/${client.id}`}>
              View
              <Glyphicon glyph="file" />
            </MenuItem>
            <MenuItem eventKey="2" href={`/clients/${client.id}/edit`}>
              Edit
              <Glyphicon glyph="pencil" />
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="3" onClick={() => this.props.handleShow(client.id)}>
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

export default ClientRow;
