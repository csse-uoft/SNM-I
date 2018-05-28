import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button, Glyphicon } from 'react-bootstrap';

// utilities
import _ from 'lodash';


export default class NeedRow extends Component {
  render() {
    const need = this.props.need

    return(
      <tr>
        <td>1</td>
        <td>{need.category}</td>
        <td>{need.description}</td>
        <td>{need.status}</td>
        <td>
          <Link to="/clients/edit">
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
