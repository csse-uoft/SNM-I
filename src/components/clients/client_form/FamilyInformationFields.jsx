import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

export default class FamilyInformationFields extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row>
        <Col sm={12}>
          <h4>Family</h4>
          <hr/>
        </Col>
        {(JSON.parse(this.props.hasChildren) ||
          this.props.maritalStatus === 'Married' ||
          this.props.maritalStatus === 'Common Law') && (
          <FormGroup controlId="file_id">
            <Col componentClass={ControlLabel} sm={3}>
              File ID
            </Col>
            <Col sm={9}>
              <FormControl
                type="text"
                value={this.props.family.file_id}
                onChange={this.props.formValChange}
              />
            </Col>
          </FormGroup>
        )}

        {(this.props.maritalStatus === 'Married' ||
          this.props.maritalStatus === 'Common Law') && (
          <div>
            <FormGroup controlId="full_name">
              <Col componentClass={ControlLabel} sm={3}>
                Spouse
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.props.family.spouse.full_name}
                  onChange={this.props.spouseChange}
                  placeholder="Full name"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="birth_date">
              <Col componentClass={ControlLabel} sm={3}>
              </Col>
              <Col sm={9}>
                <FormControl
                  type="date"
                  value={this.props.family.spouse.birth_date}
                  onChange={this.props.spouseChange}
                  placeholder="Birth date"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="gender">
              <Col componentClass={ControlLabel} sm={3}>
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.props.family.spouse.gender}
                  onChange={this.props.spouseChange}
                >
                  <option value="select">--- Gender ---</option>
                  <option value="Other">Other</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </FormControl>
              </Col>
            </FormGroup>
          </div>
        )}

        {(this.props.numOfChildren > 0) && (
          <div>
            {[...Array(parseInt(this.props.numOfChildren))].map((object, i) => {
              return (
                <div key={i}>
                  <FormGroup controlId="full_name">
                    <Col componentClass={ControlLabel} sm={3}>
                      Children #{i+1}
                    </Col>
                    <Col sm={9}>
                      <FormControl
                        type="text"
                        value={this.props.family.children[i].full_name}
                        onChange={e => this.props.childChange(e, i)}
                        placeholder="Full name"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="birth_date">
                    <Col componentClass={ControlLabel} sm={3}>
                    </Col>
                    <Col sm={9}>
                      <FormControl
                        type="date"
                        value={this.props.family.children[i].birth_date}
                        onChange={e => this.props.childChange(e, i)}
                        placeholder="Birth date"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="gender">
                    <Col componentClass={ControlLabel} sm={3}>
                    </Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass="select"
                        placeholder="select"
                        value={this.props.family.children[i].gender}
                        onChange={e => this.props.childChange(e, i)}
                      >
                        <option value="select">--- Gender ---</option>
                        <option value="Other">Other</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </FormControl>
                    </Col>
                  </FormGroup>
                </div>
              )})
            }
          </div>
        )}
      </Row>
    );
  }
}
