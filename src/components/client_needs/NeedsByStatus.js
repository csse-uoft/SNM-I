import React, { Component } from 'react';
import { Panel, Button, Badge, Accordion } from 'react-bootstrap';
import _ from 'lodash';

// store
import { connect } from 'react-redux';
import { createClientNeed, updateClientNeed, deleteClientNeed } 
  from '../../store/actions/needActions.js';

// components 
import NeedGroup from './needs_by_status/NeedGroup.js';
import NeedResourceMatcher from '../NeedResourceMatcher.js';


class NeedsByStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSearchModal: false,
      activeNeedId: undefined
    } 
  }

  render() {
    const s = this.state,
      needs = {
        withoutResources: this.withoutResources(),
        withPotentialResources: this.withPotentialResources(),
        withPendingResources: this.withPendingResources(),
        withFulfillingResources: this.withFulfillingResources()
      }, 
      headers = {
        withoutResources: this.panelHeaderContent(needs.withoutResources.length, "Needs Without Matched Resources"),
        withPotentialResources: this.panelHeaderContent(needs.withPotentialResources.length, "Needs With Matched Resources"),
        withPendingResources: this.panelHeaderContent(needs.withPendingResources.length, "Needs With Pending Resources"),
        withFulfillingResources: this.panelHeaderContent(needs.withFulfillingResources.length, "Needs Fulfilled")
      }

    return (
      <div className='needs modal-container'>
        <Button bsStyle="primary" onClick={this.addNeed}>New Need</Button>
        <Accordion defaultActiveKey="1">
          <Panel header={headers.withoutResources} collapsible eventKey="1" bsStyle="danger">
            <NeedGroup needs={needs.withoutResources} showSearchModal={this.showSearchModal}
              delete={this.deleteNeed} />
          </Panel>
          <Panel header={headers.withPotentialResources} collapsible eventKey="2" bsStyle="warning">
            <NeedGroup needs={needs.withPotentialResources} showSearchModal={this.showSearchModal}
              delete={this.deleteNeed} />
          </Panel>
          <Panel header={headers.withPendingResources} collapsible eventKey="3" bsStyle="info">
            <NeedGroup needs={needs.withPendingResources} showSearchModal={this.showSearchModal}
              delete={this.deleteNeed} />
          </Panel>
          <Panel header={headers.withFulfillingResources} collapsible eventKey="4" bsStyle="success">
            <NeedGroup needs={needs.withFulfillingResources} showSearchModal={this.showSearchModal}
              delete={this.deleteNeed} />
          </Panel>
        </Accordion>
        {s.showSearchModal &&
          <NeedResourceMatcher show={s.showSearchModal} onHide={this.closeSearchModal} 
            modalContainer={this} need={this.getNeedById(s.activeNeedId)} updateNeed={this.updateNeed} 
            deleteNeed={this.deleteNeed} activeTab={s.activeSearchModalTab} />
        }
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const p = this.props,
          newNeed = _.find(p.needs, (n) => {return n.type === ''});

    if (newNeed && !prevState.showSearchModal) {
      this.setState({ activeNeedId: newNeed.id, showSearchModal: true, activeSearchModalTab: 1 });
    }
  }

  panelHeaderContent = (needsCount, title) => {
    return <h3><Badge>{needsCount}</Badge>{title}</h3>
  }

  addNeed = (event) => {
    const p = this.props;
    p.dispatch(createClientNeed(p.clientId));
  }  

  updateNeed = (requirementsParams, needId) => {
    const p = this.props;

    console.log('posting need update with requirements...')
    console.log(requirementsParams.requirements)
    p.dispatch(updateClientNeed(p.clientId, needId, requirementsParams));
  }

  deleteNeed = (needId) => {
    const p = this.props;
    p.dispatch(deleteClientNeed(p.clientId, needId));
  }

  // Matcher Modal Methods
  showSearchModal = (needId, activeTab=2) => {
    this.setState({ activeNeedId: needId, showSearchModal: true, activeSearchModalTab: activeTab });
  }

  closeSearchModal = () => {
    this.setState({ showSearchModal: false });
    const s = this.state,
          closedNeed = this.getNeedById(s.activeNeedId);
    if (closedNeed.type === '') {
      this.deleteNeed(closedNeed.id)
    }
  }

  // Need Filtering Methods
  withoutResources() {
    const needs = _.filter(this.props.needs, (n) => {
      return n.resources.length === 0
    });
    return needs;
  }

  withPotentialResources() {
    const needs = _.filter(this.props.needs, (n) => {
      return _.find(n.resources, (r) => {return !r.pending && !r.fulfilled});
    });
    return needs;
  }

  withPendingResources() {
    const needs = _.filter(this.props.needs, (n) => {
      return _.find(n.resources, (r) => {return r.pending});
    });
    return needs;
  }

  withFulfillingResources() {
    const needs = _.filter(this.props.needs, (n) => {
      return _.find(n.resources, (r) => {return r.fulfilled});
    });
    return needs;
  }

  // Helper methods
  getNeedById = (id) => {
    const need = _.find(this.props.needs, (n) => {return n.id === id});
    return need;
  }
}

const mapStateToProps = (state) => {
  return {
    loaded: state.needs.loaded,
    clientId: state.needs.clientId,
    needs: state.needs.index
  }
}

export default connect(mapStateToProps)(NeedsByStatus);