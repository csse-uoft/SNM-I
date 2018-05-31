import React, { Component } from 'react';
import { defaults } from '../../store/defaults'
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux'
import { deleteClientNeed } from '../../store/actions/needActions.js'


// styles
import { Button, Glyphicon } from 'react-bootstrap';


class NeedRow extends Component {
  constructor(props) {
    super(props);

    this.delete = this.delete.bind(this);
  }

  delete(clientId, id) {
    this.props.dispatch(deleteClientNeed(clientId, id));
  }

  render() {
    const need = this.props.need
    const clientId = this.props.clientId

    return(
      <tr>
        <td>
          <Link to={`/needs/${need.id}`}>
            {need.id}
          </Link>
        </td>
        <td>{need.category}</td>
        <td>{need.description}</td>
        <td>{defaults['needStatus'][need.status]}</td>
        <td>
          <Link to={`/needs/${need.id}/edit`}>
            <Button bsStyle="primary">
              <Glyphicon glyph="edit" />
            </Button>
          </Link>
        </td>
        <td>
          <Button bsStyle="danger" onClick={() => this.delete(clientId, need.id)}>
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}

export default connect()(NeedRow);
