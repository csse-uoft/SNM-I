import React, { Component } from 'react';
import { defaults } from '../../store/defaults'


// redux
import { connect } from 'react-redux'


import { Table } from 'react-bootstrap';

class Need extends Component {

  render() {
    const p = this.props,
          id = p.match.params.need_id,
          need = p.needsById[id];

    return (
      <div className="content">
        <h3>Need</h3>
        { p.needsLoaded &&
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
              <tr>
                <td><b>Condition</b></td>
                <td>{need.condition}</td>
              </tr>
              <tr>
                <td><b>Status</b></td>
                <td>{defaults['needStatus'][need.status]}</td>
              </tr>
            </tbody>
          </Table>
        }
        <hr />
        <h3>Recommended Services</h3>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    needsById: state.needs.byId,
    needsLoaded: state.needs.loaded
  }
}

export default connect(
  mapStateToProps
)(Need);
