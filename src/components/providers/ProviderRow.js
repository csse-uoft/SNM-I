import React, { Component } from 'react';
import { Glyphicon, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { deleteProvider } from '../../store/actions/providerActions.js'

class ProviderRow extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }

  delete(id) {
    this.props.dispatch(deleteProvider(id));
  }

  render() {
    const p = this.props.provider;
    const currentUser = this.props.currentUser;
    const url = '/provider/' + p.id + '/edit/' + p.provider_type.toLowerCase();

    return (
      <tr>
        <td>
          {p.id}
        </td>
        <td>
          <Link to={`/provider/${p.id}`}>
            {p.provider_type==="Individual" ? p.first_name + " " + p.last_name : p.company}
          </Link>
        </td>
        <td>
          {p.provider_type}
        </td>
        <td className='centered-text'>
          {p.email}
        </td>
        <td className='centered-text'>
          {p.primary_phone_number}
        </td>
        <td>
          <EditButton currentUser={currentUser} providerStatus={p.status} url={url} />
        </td>
        <td>
          <Button
            bsStyle="danger"
            onClick={() => this.delete(p.id)}
            disabled={p.status === 'Home Agency'}
          >
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}

function EditButton({ currentUser, providerStatus, url }) {
  if (providerStatus === 'Home Agency' && currentUser && !currentUser.is_admin) {
    return (
      <Button bsStyle="primary" disabled>
        <Glyphicon glyph="edit" />
      </Button>
    );
  }
  return (
    <Link to={`${url}`}>
      <Button bsStyle="primary">
        <Glyphicon glyph="edit" />
      </Button>
    </Link>
  );
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser
  }
}

export default connect(mapStateToProps)(ProviderRow);
