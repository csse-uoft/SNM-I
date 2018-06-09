import React, { Component } from 'react';
import _ from 'lodash';
import { Well, Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';
import { Link } from 'react-router-dom';
import { fetchProviders, createProvider, updateProvider, deleteProvider, createProviderWithCSV } from '../../store/actions/providerActions.js'
import { withRouter } from 'react-router';
import { connect } from 'react-redux'

class ProviderCSVUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedFile: null}
    this.handleFileUpload=this.handleFileUpload.bind(this);
    this.handleFileSelect=this.handleFileSelect.bind(this);
  }

  handleFileUpload() {
    // const data = new FormData();
    // data.append('file', file);
    this.props.dispatch(createProviderWithCSV(this.state.selectedFile));
  }

  handleFileSelect(e) {
    this.setState({selectedFile: e.target.files[0]});
  }

  render() {
    const p = this.props, s = this.state;
    return(
      <div className='providers content'>
        <h3 className='title'>Upload Providers from CSV</h3>
          <div>
            <Well>
              <h4> Select a CSV file to upload </h4>
              <input type="file" 
                label='Upload'
                accept='.csv'
                onChange={this.handleFileSelect} 
              />
            </Well>
            <Button type="submit" onClick={this.handleFileUpload} >
              Upload
            </Button>
          </div>;
      </div>
    )
  }
}

export default connect()(withRouter(ProviderCSVUpload));
