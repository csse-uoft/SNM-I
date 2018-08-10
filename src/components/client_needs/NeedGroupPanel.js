import React, { Component } from 'react';
import _ from 'lodash';
import { Glyphicon, Panel, Button, ListGroup, ListGroupItem, Label, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default class NeedGroupPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
    this.toggleNeedsList = this.toggleNeedsList.bind(this);
  }

  toggleNeedsList() {
    this.setState({open: !this.state.open});
  }

  render() {
    const needs = this.props.needs.map(need =>
      <ListGroupItem>
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
                  {this.props.status}
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
