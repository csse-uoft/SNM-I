import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

// redux
import { connect } from 'react-redux'

class ClientRow extends Component {
  render() {
    const client = this.props.client;

    return (
      <tr>
        <td>{client.id}</td>
        <td>
          <Link to={`/clients/${client.id}`}>
            {client.personal_information.first_name} {client.personal_information.last_name}
          </Link>
        </td>
        <td className='centered-text'>
          {client.email}
        </td>
        <td>
          <Link to={`/clients/${client.id}/edit`}>
            <Button bsStyle="primary">
              <Glyphicon glyph="edit" />
            </Button>
          </Link>
        </td>
        <td>
          <Button bsStyle="danger" onClick={() => this.props.handleShow(client.id)}>
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}

export default connect()(ClientRow);
