import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

// redux
import { connect } from 'react-redux'

class ServiceRow extends Component {

  render() {
    const service = this.props.service;

    return(
      <tr>
        <td>{service.id}</td>
        <td>
          <Link to={`/service/${service.id}`}>
            {service.name}
          </Link>
        </td>
        <td className='centered-text'>
          {service.email}
        </td>
        <td>
          <Link to={`/services/${service.id}/edit`}>
            <Button bsStyle="primary">
              <Glyphicon glyph="edit" />
            </Button>
          </Link>
        </td>
        <td>
          <Button bsStyle="danger" onClick={() => this.props.handleShow(service.id)}>
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}

export default connect()(ServiceRow);
