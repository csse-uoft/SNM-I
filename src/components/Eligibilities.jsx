import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import EligibilitiesIndex from './eligibilities/EligibilitiesIndex'
import EligibilityRow from './eligibilities/EligibilityRow'

// redux
import { connect } from 'react-redux'
import { fetchEligibilities } from '../store/actions/eligibilityActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Eligibilities extends Component {
  componentWillMount() {
    this.props.dispatch(fetchEligibilities());
  }

  render() {
    const p = this.props;
    return(
      <div className='content'>
        <div>
          <h1>Eligibility Criteria</h1>
          <Link to={`/eligibility_criteria/new`}>
            <Button bsStyle="default">
              Create new eligibility Criteria
            </Button>
          </Link>
          <hr/>
          { p.eligibilitiesLoaded &&
            <EligibilitiesIndex>{
              _.map(p.eligibilitiesById, (eligibility) => {
                return <EligibilityRow key={eligibility.id} eligibility={eligibility} />
              })
            }</EligibilitiesIndex>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    eligibilitiesById: state.eligibilities.byId,
    eligibilitiesLoaded: state.eligibilities.eligibilitiesLoaded
  }
}

export default connect(
  mapStateToProps
)(Eligibilities);
