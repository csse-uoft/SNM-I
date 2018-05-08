import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './providers/ProvidersIndex.js'
import ProviderRow from './providers/ProviderRow.js'
import CrupdateModal from './shared/CrupdateModal.js'
import ProviderForm from './providers/ProviderForm.js'

// redux
import { connect } from 'react-redux'
import { fetchProviders, createProvider, updateProvider, deleteProvider } from '../store/actions.js'

// styles
import { Button } from 'react-bootstrap'

class Providers extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showCrupdateModal: false,
      activeProvider: {}
    } 
  }

  render() {
    const p = this.props, s = this.state;
    return(
      <div className='providers content'>
        <Button bsStyle="primary" onClick={this.showCrupdateModal}>New Provider</Button>
        <h3 className='title'>Providers</h3>
        { p.providersLoaded &&
          <ProvidersIndex>{
            p.providers.map((provider) => {
              return <ProviderRow key={ provider.id } provider={ provider }
                        showUpdateModal={this.showCrupdateModal} delete={this.deleteProvider} />
            })
          }</ProvidersIndex>
        }
        <CrupdateModal  show={s.showCrupdateModal} hide={this.hideCrupdateModal} 
          title={this.modalTitle()}>
          <ProviderForm action={this.formAction()} provider={s.activeProvider} />
        </CrupdateModal>
      </div>
    )
  }

  componentWillMount() {
    this.props.dispatch(fetchProviders());
  }

  createProvider = (params) => {
    this.props.dispatch(createProvider(params));
  }

  updateProvider = (params) => {
    const id = params.id;
    delete params.id;
    this.props.dispatch(updateProvider(id, params));
  }

  deleteProvider = (id) => {
    this.props.dispatch(deleteProvider(id));
  }

  showCrupdateModal = (provider={}) => {
    this.setState({ showCrupdateModal: true, activeProvider: provider })
  } 

  hideCrupdateModal = () => {
    this.setState({ showCrupdateModal: false })
  }

  activeProviderIsNew = () => {
    return(_.isUndefined(this.state.activeProvider.id));
  }

  formAction = () => {
    return(this.activeProviderIsNew() ? this.createProvider : this.updateProvider);
  }

  modalTitle = () => {
    let title = this.activeProviderIsNew() ? "New" : "Update"
    return(title + " Provider");
  }

}

const mapStateToProps = (state) => {
  return {
    providers: state.providers.index,
    providersLoaded: state.providers.loaded
  }
}

export default connect(
  mapStateToProps
)(Providers);