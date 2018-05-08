import React, { Component } from 'react';
import CustomToggle from '../shared/CustomToggle.js';
import { Link } from 'react-router-dom';
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';

export default class ClientRow extends Component {
  render() {
    const c = this.props.client;
    return(
      <tr>
        <td>
          <Link to={`/client/${c.id}`}>
            {c.first_name} {c.last_name}
          </Link>
        </td>
        <td className='centered-text'>
          {c.email}
        </td>
        <td>
          <Dropdown id='action-menu' pullRight>
          <CustomToggle bsRole="toggle">
            <Glyphicon glyph="option-vertical" /> 
          </CustomToggle>
          <Dropdown.Menu>
            <MenuItem eventKey="1" onClick={this.update}>
              <span>Update</span>
            </MenuItem>
            <MenuItem eventKey="2" onClick={this.delete}>
              <span>Delete</span>
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        </td>
      </tr>
    )
  }

  delete = () => {
    const p = this.props;
    p.delete(p.client.id);
  }

  update = () => {
    const p = this.props;
    p.showUpdateModal(p.client);
  }
}