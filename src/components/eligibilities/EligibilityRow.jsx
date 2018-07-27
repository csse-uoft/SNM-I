import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

// redux
import { connect } from 'react-redux'
import { deleteEligibility } from '../../store/actions/eligibilityActions.js'

class EligibilityRow extends Component {
  constructor(props) {
    super(props);

    this.delete = this.delete.bind(this);
  }

  delete(id) {
    this.props.dispatch(deleteEligibility(id));
  }

  render() {
    const eligibility = this.props.eligibility;
    return(
      <tr>
        <td>{eligibility.id}</td>
        <td>
          {eligibility.title}
        </td>
        <td>
          <Link to={`/eligibility_criteria/${eligibility.id}/edit`}>
            <Button bsStyle="primary">
              <Glyphicon glyph="edit" />
            </Button>
          </Link>
        </td>
        <td>
          <Button bsStyle="danger" onClick={() => this.delete(eligibility.id)}>
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}

export default connect()(EligibilityRow);
