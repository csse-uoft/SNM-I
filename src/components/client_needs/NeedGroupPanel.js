import React, { Component } from 'react';
import _ from 'lodash';
import { updateClientNeedGroup } from './../../store/actions/needActions';
import { Glyphicon, Panel, Button, ListGroup, ListGroupItem, Label, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'


class NeedGroupPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
    this.toggleNeedsList = this.toggleNeedsList.bind(this);
    this.changeNeedGroupStatus = this.changeNeedGroupStatus.bind(this);
  }

  toggleNeedsList() {
    this.setState({open: !this.state.open});
  }

  changeNeedGroupStatus() {
    let needGroup = {
      category: this.props.needGroup,
      status: (this.props.status === "Unmet") ? "Met" : "Unmet",
      person_id: this.props.clientId,
      id: this.props.needGroupId
    }
    this.props.dispatch(updateClientNeedGroup(this.props.clientId, needGroup.id, needGroup));
  }

  render() {
    const needs = this.props.needs.map(need =>
      <ListGroupItem key={need.id}>
        <Row>
          <Col sm={2}>
            <Label bsStyle="primary">{need.type}</Label>{' '}
          </Col>
          <Col sm={7}>
            <Link to={`/needs/${need.id}`}>
              Find Services/Goods
            </Link>
            <p>{need.description}</p>
          </Col>
          <Col sm={3}>
            <Link to={`/needs/${need.id}/edit`}>
              <Button bsStyle="link">
                <Glyphicon glyph="pencil" />
                Edit
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={9}>
          </Col>
          <Col sm={3}>
            <Button bsStyle="link" onClick={() => this.props.handleShow(need.id)}>
              <Glyphicon glyph="trash" />
              Delete
            </Button>
          </Col>
        </Row>
      </ListGroupItem>
    );

    return (
      <div>
        <Panel id={this.props.needGroup} defaultExpanded>
          <Panel.Heading>
            <Panel.Title toggle>
              <Row>
                <Col sm={10}>
                  {this.props.needGroup}
                </Col>
                <Col sm={2}>
                  <Button
                    bsStyle={(this.props.status === "Unmet") ? "danger" : "success"}
                    onClick={this.changeNeedGroupStatus}
                  >
                    {this.props.status}
                  </Button>{' '}
                </Col>
              </Row>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <ListGroup>
              {needs}
            </ListGroup>
          </Panel.Collapse>
        </Panel>
      </div>
    );
  }
}

export default connect()(NeedGroupPanel);
