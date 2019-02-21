import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import GeneralField from '../shared/GeneralField';
import SelectField from '../shared/SelectField';

// redux
import { connect } from 'react-redux'
import { createAppointment } from '../../store/actions/appointmentActions.js'

class AppointmentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        'type': '',
        'category': '',
        'status': '',
        'description': '',
        'date': '',
        'start_time': '',
        'end_time': '',
        'reminder_type': '',
        'reminder_frequency': '',
      }
    };

    this.formValChange = this.formValChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let form = Object.assign({}, this.state.form);
    form['service_id'] = this.props.serviceId;
    form['client_id'] = this.props.clientId;

    this.props.dispatch(
      createAppointment(form, (status, err, appointment) => {
        this.props.onHide()
      })
    );
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
        bsSize="large"
        aria-labelledby="contained-modal-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">
            Appointment
            {this.state.form.service_id}
            {this.state.form.provider_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <SelectField
              id="type"
              label="Type"
              options={['External', 'Internal']}
              componentClass="select"
              value={this.state.form.type}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="category"
              label="Category"
              type="text"
              value={this.state.form.category}
              onChange={this.formValChange}
            />
            <GeneralField
              id="status"
              label="Status"
              type="text"
              value={this.state.form.status}
              onChange={this.formValChange}
            />
            <GeneralField
              id="description"
              label="Description"
              type="text"
              value={this.state.form.description}
              onChange={this.formValChange}
            />
            <GeneralField
              id="date"
              label="Date"
              type="date"
              value={this.state.form.date}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="start_time"
              label="Start Time"
              type="time"
              value={this.state.form.start_time}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="end_time"
              label="End Time"
              type="time"
              value={this.state.form.end_time}
              onChange={this.formValChange}
              required
            />
            <SelectField
              id="reminder_type"
              label="Reminder Type"
              options={['Email', 'Text', 'Phone']}
              componentClass="select"
              value={this.state.form.reminder_type}
              onChange={this.formValChange}
            />
            <GeneralField
              id="reminder_frequency"
              label="Reminder Frequecy"
              type="text"
              value={this.state.form.reminder_frequency}
              onChange={this.formValChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect()(AppointmentModal);
