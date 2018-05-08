import React, { Component } from 'react';
import _ from 'lodash';

// components
import ResourcesIndex from './resources/ResourcesIndex.js';
import CrupdateModal from './shared/CrupdateModal.js';
import ResourceForm from './resources/ResourceForm.js';
import ResourceRow from './resources/ResourceRow.js';

// redux
import { connect } from 'react-redux';
import { fetchResources, createResource, updateResource, deleteResource, fetchProviders } from '../store/actions.js';

// styles
import { Button } from 'react-bootstrap';

class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showCrupdateModal: false,
      activeResource: {}
    } 
  }

  render() {
    const p = this.props, s = this.state;
    return(
      <div className='resources content'>
        <Button bsStyle="primary" onClick={this.showCrupdateModal}>New Service</Button>
        <h3 className='title'>Services</h3>
        { p.resourcesLoaded &&
          <ResourcesIndex>{
            p.resources.map((resource) => {
              return <ResourceRow key={ resource.id } resource={ resource }
                        showUpdateModal={this.showCrupdateModal} delete={this.deleteResource} />
            })
          }</ResourcesIndex>
        }
        <CrupdateModal  show={s.showCrupdateModal} hide={this.hideCrupdateModal} 
          title={this.modalTitle()}>
          <ResourceForm action={this.formAction()} resource={s.activeResource} providers={p.providers} />
        </CrupdateModal>
      </div>
    )
  }

  componentWillMount() {
    this.props.dispatch(fetchResources());
    this.props.dispatch(fetchProviders());
  }

  createResource = (params) => {
    this.props.dispatch(createResource(params));
  }

  updateResource = (params) => {
    const id = params.id;
    delete params.id;
    this.props.dispatch(updateResource(id, params));
  }

  deleteResource = (id) => {
    this.props.dispatch(deleteResource(id));
  }

  showCrupdateModal = (resource={}) => {
    this.setState({ showCrupdateModal: true, activeResource: resource })
  }

  hideCrupdateModal = () => {
    this.setState({ showCrupdateModal: false })
  }

  activeResourceIsNew = () => {
    return(_.isUndefined(this.state.activeResource.id));
  }

  formAction = () => {
    return(this.activeResourceIsNew() ? this.createResource : this.updateResource);
  }

  modalTitle = () => {
    let title = this.activeResourceIsNew() ? "New" : "Update"
    return(title + " Resource");
  }
}

const mapStateToProps = (state) => {
  return {
    resources: state.resources.index,
    resourcesLoaded: state.resources.loaded,
    providers: state.providers.index,
    providersLoaded: state.providers.loaded
  }
}

export default connect(
  mapStateToProps
)(Resources);