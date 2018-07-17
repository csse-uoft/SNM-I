import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

export default class CountryOfOriginFields extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row>
        <FormGroup controlId="country_of_origin">
          <Col componentClass={ControlLabel} sm={3}>
            Country of Origin
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={this.props.country_of_origin}
              onChange={this.props.formValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="country_of_last_residence">
          <Col componentClass={ControlLabel} sm={3}>
            Country of Last Residence
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={this.props.country_of_last_residence}
              onChange={this.props.formValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="first_language">
          <Col componentClass={ControlLabel} sm={3}>
            First Language
          </Col>
          <Col sm={9}>
            <FormControl
              componentClass="select"
              placeholder="select"
              value={this.props.first_language}
              onChange={this.props.formValChange}
            >
              <option value="select">-- Not Set --</option>
              { this.props.categoriesLoaded &&
                this.props.cateogiresIntoOptions(this.props.languagesCategories)
              }
            </FormControl>
          </Col>
        </FormGroup>

        <FormGroup controlId="other_languages">
          <Col componentClass={ControlLabel} sm={3}>
            Other languages
          </Col>
          <Col sm={9}>
            {this.props.categoriesLoaded &&
              this.props.cateogiresIntoCheckboxes(
                this.props.languagesCategories,
                this.props.first_language,
                this.props.other_languages,
                this.props.formValChange
              )
            }
          </Col>
        </FormGroup>

        <FormGroup controlId="pr_number">
          <Col componentClass={ControlLabel} sm={3}>
            Permanent Residence Card Number (PR card)
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={this.props.pr_number}
              onChange={this.props.formValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="immigration_doc_number">
          <Col componentClass={ControlLabel} sm={3}>
            Immigration Document Number (if different from PR card):
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={this.props.immigration_doc_number}
              onChange={this.props.formValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="landing_date">
          <Col componentClass={ControlLabel} sm={3}>
            Landing Date
          </Col>
          <Col sm={9}>
            <FormControl
              type="date"
              value={this.props.landing_date}
              onChange={this.props.formValChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="arrival_date">
          <Col componentClass={ControlLabel} sm={3}>
            Arrival Date (if different from landing_date):
          </Col>
          <Col sm={9}>
            <FormControl
              type="date"
              value={this.props.arrival_date}
              onChange={this.props.formValChange}
            />
          </Col>
        </FormGroup>
      </Row>
    );
  }
}
