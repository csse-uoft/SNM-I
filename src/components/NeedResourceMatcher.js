import React, { Component } from 'react';
import _ from 'lodash';


// store
import { fetchProviderResources } from '../store/actions.js';
import { saveNeedMatchState, deleteNeedMatchState } from '../store/actions/needActions.js';
import { connect } from 'react-redux';

// Components
import NeedControls from './need_resource_matcher/NeedControls.js';
import RecommendedResources from './need_resource_matcher/RecommendedResources.js';
import ResourceProvider from './need_resource_matcher/recommended_resources/ResourceProvider.js';

// Styles
import { Modal, Tab, Nav, NavItem } from 'react-bootstrap';
import 'react-select/dist/react-select.css';
import '../stylesheets/NeedResourceMatcher.css';

class NeedResourceMatcher extends Component {
  render() {
    const p = this.props,
          resourceSearchResponse = p.searchResultsByNeedId[p.need.id],
          searchResponseInitialized = !_.isUndefined(resourceSearchResponse),
          resourcesLoaded = searchResponseInitialized && resourceSearchResponse.loaded,
          resourcesByProvider = searchResponseInitialized && resourceSearchResponse.result;
    return (
      <Modal show={p.show} onHide={p.onHide} container={p.modalContainer} bsSize='lg'
        aria-labelledby="contained-modal-title">
        <Modal.Header closeButton>
          <NeedControls need={p.need} updateNeed={p.updateNeed} 
            fetchResources={this.fetchResources} />
        </Modal.Header>
        <Modal.Body>
          <Tab.Container id="tabs" defaultActiveKey={p.activeTab} >
            <div>
              <Nav bsStyle="pills">
                <NavItem eventKey={1}>Resource Search</NavItem>
                <NavItem eventKey={2}>Matched Resources</NavItem>
              </Nav>
              <Tab.Content animation>
                <Tab.Pane eventKey={1}>
                  {resourcesLoaded && 
                    <RecommendedResources resourcesByProvider={resourcesByProvider} 
                      saveMatchState={this.saveMatchState} deleteMatchState={this.deleteMatchState}
                      matchedResources={p.need.resources} />
                  }
                </Tab.Pane>
                <Tab.Pane eventKey={2}>
                  {!_.isEmpty(p.need.resources) &&
                    <ul className='provider-resources'>
                      {
                        this.matchedResourcesByProvider().map((provider) => { 
                          return <ResourceProvider key={provider.id} provider={provider} 
                            saveMatchState={this.saveMatchState} deleteMatchState={this.deleteMatchState}
                            matchedResources={p.need.resources} />
                        })
                      }
                    </ul>
                  }
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    )
  }



  fetchResources = (needType, detailsParams) => {
    const p = this.props,
    params = {
      resource_type: needType,
      details: detailsParams
    }
    p.dispatch(fetchProviderResources(p.need.id, params));
  }

  saveMatchState = (resourceId, pending=false, fulfilled=false) => {
    const p = this.props;
    p.dispatch(saveNeedMatchState(resourceId, p.need.id, pending, fulfilled));
  }



  deleteMatchState = (resourceId) => {
    const p = this.props;
    p.dispatch(deleteNeedMatchState(resourceId, p.need.id));
  }

  matchedResourcesByProvider = () => {
    const p = this.props;
    let matchedResourcesByProvider = p.need.resources.map((r) => {
      let resource = r.resource;
      return _.assign({resources: [resource]}, resource.provider);
    });
    return matchedResourcesByProvider;
  }
}

const mapStateToProps = (state) => {
  return {
    searchResultsByNeedId: state.searchResultsByNeedId
  }
}

export default connect(
  mapStateToProps
)(NeedResourceMatcher);
