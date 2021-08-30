import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// styles
import { Button } from 'react-bootstrap';
import { PriorityHigh, Edit } from "@material-ui/icons";

import { connect } from 'react-redux'
import { fetchClients } from '../../store/actions/clientActions.js'


class NeedRow extends Component {
  componentWillMount() {
      this.props.dispatch(fetchClients());
  }

  render() {
    const p = this.props;
    const need = p.need;

    return(
      <tr>
        <td>
          {need.is_urgent && (
            <span className='need-urgent'>
              <PriorityHigh fontSize="small" />
              {' '}
            </span>)
          }
          <Link to={`/needs/${need.id}`}>
            {need.id}
          </Link>
        </td>
        <td>
          <Link to={`/clients/${need.client_id}/`}>
            {p.clients[need.client_id].profile.first_name + ' ' + p.clients[need.client_id].profile.last_name}
          </Link>
        </td>
        <td>{need.type}</td>
        <td>{need.description}</td>
        <td>
          <Link to={`/needs/${need.id}/edit`}>
            <Button bsStyle="primary">
              <Edit fontSize="small"/>
            </Button>
          </Link>
        </td>
      </tr>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    clients: state.clients.byId,
    clientsOrder: state.clients.order,
    clientsLoaded: state.clients.clientsLoaded
  }
}

export default connect(
  mapStateToProps
)(NeedRow);
