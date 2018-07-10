import React, { Component } from 'react';
import _ from 'lodash';

import RecommendedService from './RecommendedService'

// redux
import { connect } from 'react-redux'
import { fetchNeed } from '../../store/actions/needActions.js'
import { Link } from 'react-router-dom';

import { Table, Label, ListGroup } from 'react-bootstrap';

class Need extends Component {
  componentWillMount() {
    const id = this.props.match.params.need_id
    this.props.dispatch(fetchNeed(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.need_id,
          need = p.needsById[id];

    return (
      <div className="content">
        <h3>Need</h3>
        { need && need.is_deleted &&
          <h4>
            <Label bsStyle="danger">deleted</Label>
          </h4>
        }
        { need && need.is_urgent &&
          <h4>
            <Label bsStyle="danger">Urgent</Label>
          </h4>
        }
        { need && need.loaded &&
          <div>
            <Table striped bordered condensed hover>
              <tbody>
                <tr>
                  <td><b>Type</b></td>
                  <td>{need.type}</td>
                </tr>
                <tr>
                  <td><b>Category</b></td>
                  <td>{need.category}</td>
                </tr>
                <tr>
                  <td><b>Needed by</b></td>
                  <td>{need.needed_by}</td>
                </tr>
                <tr>
                  <td><b>Description</b></td>
                  <td>{need.description}</td>
                </tr>
                {
                  (need.type === 'Good') && (
                    <tr>
                      <td><b>Condition</b></td>
                      <td>{need.condition}</td>
                    </tr>
                  )
                }
                <tr>
                  <td><b>Status</b></td>
                  <td>
                    {need.status}
                    <Link to={`/service/${need.service_id}/edit`}>
                      {` ${need.service_id}`}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </Table>
            <hr />
            <h3>Recommended Services</h3>
            <div>
              {
                _.map(need.recommended_services, (service) => {
                  return (
                    <RecommendedService
                      key={service.id}
                      service={service}
                      need={need}
                    />
                  )
                })
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    needsById: state.needs.byId
  }
}

export default connect(
  mapStateToProps
)(Need);
