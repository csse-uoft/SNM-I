import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

export default class ClientRow extends Component {
  render() {
    const c = this.props.client;
    return(
      <tr>
        <td>{c.id}</td>
        <td>
          <Link to={`/client/${c.id}`}>
            {c.first_name} {c.last_name}
          </Link>
        </td>
        <td className='centered-text'>
          {c.email}
        </td>
        <td>
          <Link to={`/clients/edit`}>
            <Button bsStyle="primary">
              <Glyphicon glyph="edit" />
            </Button>
          </Link>
        </td>
        <td>
          <Button bsStyle="danger">
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}