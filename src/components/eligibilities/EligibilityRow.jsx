import React, { Component } from 'react';
import DropdownMenu from '../shared/DropdownMenu'


class EligibilityRow extends Component {
  render() {
    const eligibility = this.props.eligibility;
    return(
      <tr>
        <td>
          {eligibility.title}
        </td>
        <td>
          <DropdownMenu
            hideViewOption
            urlPrefix="eligibility-criteria"
            objectId={eligibility.id}
            handleShow={this.props.handleShow}
          />
        </td>
      </tr>
    )
  }
}

export default EligibilityRow;
