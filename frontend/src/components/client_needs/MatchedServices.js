import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';

import AppointmentModal from '../appointments/AppointmentModal';
import { matchStatusOptions } from '../../store/defaults.js';
import { updateMatchStatus, createMatchNote } from '../../store/actions/needActions.js'

import { Col, Accordion, Card, Form, FormGroup, FormLabel,
  FormControl, Button } from 'react-bootstrap';

class MatchedServices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeKey: null,
      matchStatusForm: {},
      noteForm: {},
      modalShow: false,
      appointmentServiceId: null
    }

    this.handleSelect = this.handleSelect.bind(this);

    this.matchStatusChange = this.matchStatusChange.bind(this);
    this.textAreaChange = this.textAreaChange.bind(this);
    this.submitMatchStatus = this.submitMatchStatus.bind(this);
    this.submitNote = this.submitNote.bind(this);

    this.handleModalHide = this.handleModalHide.bind(this);
    this.handleModalShow = this.handleModalShow.bind(this);
  }

  submitMatchStatus(matchId) {
    this.props.dispatch(updateMatchStatus(matchId, this.state.matchStatusForm[matchId]));
  }

  submitNote(matchId) {
    let form = {...this.state.noteForm[matchId], object_id: matchId, model: 'match' }
    this.props.dispatch(createMatchNote(form));
  }

  matchStatusChange(e, matchId) {
    const nextForm = { ...this.state.matchStatusForm, [matchId]: { status: e.target.value }}
    this.setState({
      matchStatusForm: nextForm
    });
  }

  textAreaChange(e, matchId) {
    const nextForm = { ...this.state.noteForm, [matchId]: { text: e.target.value }}
    this.setState({
      noteForm: nextForm
    });
  }

  handleModalHide() {
    this.setState({ modalshow: false });
  }

  handleModalShow(serviceId) {
    this.setState({
      modalshow: true,
      appointmentServiceId: serviceId
    })
  }

  handleSelect(activeKey) {
    this.setState({
      activeKey: activeKey,
    });
  }

  render() {
    const matches = this.props.matches;
    return (
      <div>
        <Col sm={12}>
          <h3>Matched Services</h3>
        </Col>
        <Col sm={12}>
          <Accordion
            id="accordion"
            activeKey={this.state.activeKey}
          >
            {
              _.map(matches, (match, index) => {
                return (
                  <Card key={match.id} eventKey={match.id} bsStyle="info">
                    <Card.Header onClick={() => this.handleSelect(index)}>
                      <Col sm={11}>
                        <Card.Title toggle>
                          {index+1}. {match.service.name}
                          {' '}
                        </Card.Title>
                      </Col>
                      <Form.Label bsStyle="primary">
                        {match.status}
                      </Form.Label>
                    </Card.Header>
                    <Accordion.Collapse eventKey={index}>
                      <Card.Body collapsible>
                        <Col sm={8}>
                          <FormGroup controlId="match_status">
                            <Col componentClass={FormLabel} sm={3}>
                              Status
                            </Col>
                            <Col sm={6}>
                              <FormControl
                                componentClass="select"
                                placeholder="select"
                                defaultValue={match.status}
                                onChange={e => this.matchStatusChange(e, match.id)}
                              >
                                <option value="select">--- Not Set ---</option>
                                {matchStatusOptions.map(status =>
                                  <option key={status} value={status}>{status}</option>
                                )}
                              </FormControl>
                            </Col>
                            <Col sm={3}>
                              <Button
                                disabled={this.state.activeKey !== match.id || !this.state.matchStatusForm[match.id]}
                                onClick={e => this.submitMatchStatus(match.id)}
                              >
                                Update Status
                              </Button>
                            </Col>
                          </FormGroup>
                          <Form.Label className='note-form'>
                            <FormGroup controlId="notes">
                              <Col componentClass={FormLabel} sm={3}>
                                Notes
                              </Col>
                              <Col sm={9}>
                                {
                                  _.map(match.notes, (note, index) => {
                                    return (
                                      <div key={index}>
                                        {note}
                                      </div>
                                    )
                                  })
                                }
                                <FormControl
                                  componentClass="textarea"
                                  onChange={e => this.textAreaChange(e, match.id)}
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup>
                              <Col smOffset={3} sm={9}>
                                <Button
                                  disabled={this.state.activeKey !== match.id || !this.state.noteForm[match.id]}
                                  onClick={e => this.submitNote(match.id)}
                                >
                                  Add Note
                                </Button>
                              </Col>
                            </FormGroup>
                          </Form.Label>
                          <Button bsStyle="default"  onClick={e => this.handleModalShow(match.service.id)}>
                            Add appointment
                          </Button>
                        </Col>
                        <Col sm={4}>
                          <Link to={`/service/${match.service.id}`} target="_blank">
                            <h5>View Service Detail</h5>
                          </Link>
                          <Link to={`/provider/${match.service.provider.id}`} target="_blank">
                            <h5>View Provider Detail</h5>
                          </Link>
                        </Col>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                )
              })
            }
          </Accordion>
        </Col>
        <AppointmentModal
          clientId={this.props.clientId}
          serviceId={this.state.appointmentServiceId}
          show={this.state.modalshow}
          onHide={this.handleModalHide}
        />
      </div>
    )
  }
}

export default connect()(withRouter(MatchedServices));
