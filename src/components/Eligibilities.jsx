import _ from 'lodash';
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { ACTION_ERROR } from '../store/defaults.js'

import EligibilitiesIndex from './eligibilities/EligibilitiesIndex'
import EligibilityRow from './eligibilities/EligibilityRow'
import DeleteModal from './shared/DeleteModal'

// redux
import { connect } from 'react-redux'
import { fetchEligibilities, deleteEligibility } from '../store/actions/eligibilityActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.scss';

class Eligibilities extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      deleteModalShow: false,
      objectId: null,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchEligibilities());
  }

  handleDeleteModalHide() {
    this.setState({ deleteModalShow: false });
  }

  handleDeleteModalShow(id) {
    this.setState({
      deleteModalShow: true,
      objectId: id
    })
  }

  handleDelete(id, form) {
    this.props.dispatch(
      deleteEligibility(id, form, status => {
        if (status === ACTION_ERROR) {
          // this.setState({ displayError: true });
        } else {
          this.setState({ deleteModalShow: false });
        }
      })
    );
  }

  render() {
    const p = this.props;
    return(
      <div className="content">
        <div>
          <h1>Eligibility Criteria</h1>
          <Link to="/eligibility-criteria/new">
            <Button bsStyle="default">
              Create new eligibility criteria
            </Button>
          </Link>
          <hr/>
          {p.eligibilitiesLoaded &&
            <EligibilitiesIndex>{
              _.map(p.eligibilitiesById, (eligibility) => {
                return (
                  <EligibilityRow
                    key={eligibility.id}
                    eligibility={eligibility}
                    handleShow={this.handleDeleteModalShow}
                  />
                );
              })
            }</EligibilitiesIndex>
          }
          <DeleteModal
            contentType="Eligibility Criteria"
            objectId={this.state.objectId}
            show={this.state.deleteModalShow}
            onHide={this.handleDeleteModalHide}
            delete={this.handleDelete}
          />
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
