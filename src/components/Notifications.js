import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import TableRow from './shared/TableRow'
import NeedsIndex from './client_needs/NeedsIndex';

// redux
import { connect } from 'react-redux'
import { fetchNeeds } from '../store/actions/needActions.js'

import { formatLocation } from '../helpers/location_helpers'
import { formatPhoneNumber } from '../helpers/phone_number_helpers'

import { Table, Label, Glyphicon, Button } from 'react-bootstrap';


class Notifications extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchNeeds());
  }

  render() {
    const p = this.props;
    let needsOrder = [];
    for (var i = 0; i < p.needs.length; i++) { 
      needsOrder.push(i);
    }

    return (
      <div className="content client">
        <h3>Notifications</h3>
        <hr />
        <h3>Needed within 2 days</h3>
        { p.needsLoaded &&
          <NeedsIndex
          needs={p.needs}
          needsOrder={needsOrder}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    needs: state.needs.needs,
    needsById: state.needs.byId,
    needsLoaded: state.needs.loaded,
  }
}

export default connect(
  mapStateToProps
)(Notifications);
