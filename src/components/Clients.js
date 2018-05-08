import React, { Component } from 'react'
import _ from 'lodash'

// components
import ClientsIndex from './clients/ClientsIndex.js'
import CrupdateModal from './shared/CrupdateModal.js'
import ClientForm from './clients/ClientForm.js'
import ClientRow from './clients/ClientRow.js'

// redux
import { connect } from 'react-redux'
import { fetchClients, createClient, updateClient, deleteClient } from '../store/actions.js'
import ReactFileReader from 'react-file-reader'

// styles
import { Button } from 'react-bootstrap'

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showCrupdateModal: false,
      activeClient: {}
    } 
  }

  render() {
    const p = this.props, s = this.state;
    return(
      <div className='clients content'>
        <Button bsStyle="primary" onClick={this.showCrupdateModal}>New Client</Button> 


        <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
          <Button style={{marginRight:'5px'}} id="myButton" bsStyle="primary" className='btn'>Import</Button>
        </ReactFileReader> 

        <h3 className='title'>Clients</h3>
        { p.clientsLoaded &&
          <ClientsIndex>{
            p.clients.map((client) => {
              return <ClientRow key={ client.id } client={ client }
                        showUpdateModal={this.showCrupdateModal} delete={this.deleteClient} />
            })
          }</ClientsIndex>
        }
        <CrupdateModal  show={s.showCrupdateModal} hide={this.hideCrupdateModal} 
          title={this.modalTitle()}>
          <ClientForm action={this.formAction()} client={s.activeClient} />
        </CrupdateModal>
      </div>
    )
  }

  componentWillMount() {
    this.props.dispatch(fetchClients());
  }

  createClient = (params) => {
    this.props.dispatch(createClient(params));
  }

  createClients = (csvtext) => {

  }

  updateClient = (params) => {
    const id = params.id;
    delete params.id;
    this.props.dispatch(updateClient(id, params));
  
  }

  deleteClient = (id) => {
    this.props.dispatch(deleteClient(id));
  }

  showCrupdateModal = (client={}) => {
    this.setState({ showCrupdateModal: true, activeClient: client })
  } 

  handleFiles = files => {
    var reader = new FileReader();
    var propper = this.props
    
    reader.onload = function(e) {
      console.log(reader.result)
      propper.dispatch(createClient(reader.result))
    }
    reader.readAsText(files[0]);
    
  }



  hideCrupdateModal = () => {
    this.setState({ showCrupdateModal: false })
  } 

  activeClientIsNew = () => {
    return(_.isUndefined(this.state.activeClient.id));
  }

  formAction = () => {
    return(this.activeClientIsNew() ? this.createClient : this.updateClient);
  }





  modalTitle = () => {
    let title = this.activeClientIsNew() ? "New" : "Update"
    return(title + " Client");
  }
}

const mapStateToProps = (state) => {
  return {
    clients: state.clients.index,
    clientsLoaded: state.clients.indexLoaded
  }
}

export default connect(
  mapStateToProps
)(Clients);