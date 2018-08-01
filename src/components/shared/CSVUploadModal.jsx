import React, { Component } from 'react';
import { Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class CSVUploadModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Upload CSV</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="file">
            <FormControl type="file" />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.submit}>Submit</Button>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
