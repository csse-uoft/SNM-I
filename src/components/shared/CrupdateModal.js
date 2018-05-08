import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class CrupdateModal extends Component {
  render() {
    const p = this.props;
    return(
      <Modal show={p.show} onHide={p.hide} bsSize='lg'>
        <Modal.Header closeButton>
          <h4>{p.title}</h4>
        </Modal.Header>
        <Modal.Body>
          {p.children}
        </Modal.Body>
      </Modal>
    )
  }
}