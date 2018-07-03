import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

// redux
import { connect } from 'react-redux'

class GoodRow extends Component {
  render() {
    const good = this.props.good;

    return(
      <tr>
        <td>{good.id}</td>
        <td>
          <Link to={`/good/${good.id}`}>
            {good.name}
          </Link>
        </td>
        <td className='centered-text'>
          <Link to={`/provider/${good.provider.id}`}>
                    {`${good.provider.first_name} ${good.provider.last_name}`}
          </Link>
        </td>
        <td>
          <Link to={`/goods/${good.id}/edit`}>
            <Button bsStyle="primary">
              <Glyphicon glyph="edit" />
            </Button>
          </Link>
        </td>
        <td>
          <Button bsStyle="danger" onClick={() => this.props.handleShow(good.id)}>
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}

export default connect()(GoodRow);
