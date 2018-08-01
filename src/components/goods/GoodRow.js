import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Dropdown, MenuItem, Button } from 'react-bootstrap';

// redux
import { connect } from 'react-redux'

class GoodRow extends Component {
  render() {
    const good = this.props.good;

    return(
      <tr>
        <td>
          <Link to={`/good/${good.id}`}>
            {good.name}
          </Link>
        </td>
          {good.provider.provider_type === "Organization" &&
            <td className='centered-text'>
              <Link to={`/provider/${good.provider.id}`}>
                {good.provider.company}
              </Link>
            </td>
          }

          {good.provider.provider_type === "Individual" &&
            <td className='centered-text'>
              <Link to={`/provider/${good.provider.id}`}>
                {`${good.provider.first_name} ${good.provider.last_name}`}
              </Link>
            </td>
          }

        <td>
          {good.desc}
        </td>

        <td>
          {good.category}
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
            <MenuItem eventKey="1" href={`/good/${good.id}`}>
              View
              <Glyphicon glyph="file" />
            </MenuItem>
            <MenuItem eventKey="2" href={`/good/${good.id}/edit`}>
              Edit
              <Glyphicon glyph="pencil" />
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="3" onClick={() => this.props.handleShow(good.id)}>
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

export default connect()(GoodRow);
