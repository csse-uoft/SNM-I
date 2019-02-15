import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';

// redux
import { connect } from 'react-redux'

class ServiceRow extends Component {

  render() {
    const service = this.props.service;

    return(
      <tr>
        <td>
          <Link to={`/service/${service.id}`}>
            {service.name}
          </Link>
        </td>
        {service.provider.type === "Organization" &&
          <td className="centered-text">
            <Link to={`/provider/${service.provider.id}`}>
              {service.provider.company}
            </Link>
          </td>
        }

        {service.provider.type === "Individual" &&
          <td className="centered-text">
            <Link to={`/provider/${service.provider.id}`}>
              {`${service.provider.profile.first_name} ${service.provider.profile.last_name}`}
            </Link>
          </td>
        }

        <td>
          {service.desc}
        </td>

        <td>
          {service.category}
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
            <MenuItem eventKey="1" href={`/service/${service.id}`}>
              View
              <Glyphicon glyph="file" />
            </MenuItem>
            <MenuItem eventKey="2" href={`/services/${service.id}/edit`}>
              Edit
              <Glyphicon glyph="pencil" />
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="3" onClick={() => this.props.handleShow(service.id)}>
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

export default connect()(ServiceRow);
