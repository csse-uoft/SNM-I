import React, { Component } from 'react';
import { Modal, Button, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

export default class DeleteModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        reason: ''
      }
    };

    this.formValChange = this.formValChange.bind(this);
  }

  formValChange(e, id=e.target.id) {
    let nextForm = { ...this.state.form, [id]: e.target.value };
    this.setState({ form: nextForm });
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        bsSize="small"
        aria-labelledby="contained-modal-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Delete {this.props.contentType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="reason">
            <Row>
              <Col componentClass={ControlLabel} sm={3}>
                Reason
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.reason}
                  onChange={this.formValChange}
                />
              </Col>
            </Row>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.delete(this.props.objectId, this.state.form)}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
