import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

// redux
import { connect } from 'react-redux'
import { deleteClient } from '../../store/actions/clientActions.js'

class ServiceRow extends Component {
  constructor(props) {
    super(props);

    this.delete = this.delete.bind(this);
  }

  delete(id) {
    this.props.dispatch(deleteClient(id));
  }

  render() {
    const client = this.props.client;

    return(
      <tr>
        <td>{client.id}</td>
        <td>
          <Link to={`/service/${client.id}`}>
            {client.first_name} {client.last_name}
          </Link>
        </td>
        <td className='centered-text'>
          {client.email}
        </td>
        <td>
          <Link to={`/services/${client.id}/edit`}>
            <Button bsStyle="primary">
              <Glyphicon glyph="edit" />
            </Button>
          </Link>
        </td>
        <td>
          <Button bsStyle="danger" onClick={() => this.delete(client.id)}>
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}

export default connect()(ServiceRow);
