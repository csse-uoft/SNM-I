import React, { Component } from 'react';
import CustomToggle from '../shared/CustomToggle.js';
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'; 

export default class ProviderRow extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    console.log(this.props)
  }


  render() {
    const p = this.props.provider;
    const url = '/provider' + p.id + '/edit/' + p.provider_type.toLowerCase();

    return(
      <tr>
      <Link to={`/provider/${p.id}`}>
        <td>
          {p.first_name} {p.last_name}
        </td>
      </Link>
        
        <td>
          {p.provider_type}
        </td>

        <td className='centered-text'>
          {p.email}
        </td>
        <td className='centered-text'>
          {p.phone}
        </td>

        <td>
          <Dropdown id='action-menu' pullRight>
          <CustomToggle bsRole="toggle">
            <Glyphicon glyph="option-vertical" /> 
          </CustomToggle>
          <Dropdown.Menu>
          {/*<Link to={`/provider/${p.id}/edit/${p.provider_type.toLowerCase()}`}>
            <MenuItem eventKey="1">
              <span>Update</span>
            </MenuItem>
          </Link>*/}
            <MenuItem eventKey="2" onClick={this.delete}>
              <span>Delete</span>
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        </td>
      </tr>
    )
  }

  delete() {
    const p = this.props;
    p.delete(p.provider.id);
  }

  update() {
    const p = this.props;
  }

  updateProvider() {
    const url = '/provider' + this.props.provider.id + '/edit/' + this.props.provider.provider_type.toLowerCase();
    this.props.history.push(url);
  }
}
