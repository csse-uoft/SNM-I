import _ from 'lodash';
import React from 'react';
import FormField from '../../shared/FormField'
import SelectField from '../../shared/SelectField'
import { genderOptions, familyRelationshipOptions } from '../../../store/defaults.js';
import { FormGroup, FormControl, ControlLabel, Col, Row, Button } from 'react-bootstrap';

function FamilyMemberFields({ index, member, handleFormValChange, handleRemoveFamilyButtonClick }) {
  const count = index + 1;
  return (
    <div>
      <FormGroup controlId="full_name">
        <Col componentClass={ControlLabel} sm={3}>
          Family Member #{count}
        </Col>
        <Col sm={8}>
          <FormControl
            type="text"
            onChange={e => handleFormValChange(e, index)}
            value={member.full_name}
            placeholder="Full name"
          />
        </Col>
        <Col sm={1}>
          <Button
            bsStyle="danger"
            bsSize="small"
            onClick={e => handleRemoveFamilyButtonClick(index)}
          >
            Remove
          </Button>
        </Col>
      </FormGroup>
      <FormField
        id="birth_date"
        type="date"
        value={member.birth_date}
        onChange={e => handleFormValChange(e, index)}
      />
      <SelectField
        id="gender"
        options={genderOptions}
        componentClass="select"
        value={member.gender}
        onChange={e => handleFormValChange(e, index)}
        defaultOptionTitle="Gender"
      />
      <SelectField
        id="relationship"
        options={familyRelationshipOptions}
        componentClass="select"
        value={member.relationship}
        onChange={e => handleFormValChange(e, index)}
        defaultOptionTitle="Relationship"
      />
    </div>
  )
}

export default function FamilyInformationFields({ family,
                                                  handleFormValChange,
                                                  handleAddFamilyButtonClick,
                                                  handleRemoveFamilyButtonClick }) {
  return (
    <Row>
      <FormField
        id="file_id"
        label="File ID"
        type="text"
        value={family.file_id}
        onChange={handleFormValChange}
      />
      {_.map(family.members, (member, index) => {
        return (
          <FamilyMemberFields
            key={index}
            index={index}
            member={member}
            handleFormValChange={handleFormValChange}
            handleRemoveFamilyButtonClick={handleRemoveFamilyButtonClick}
          />
        )
      })}
      <FormGroup>
        <Col smOffset={3} sm={9}>
          <Button onClick={e => handleAddFamilyButtonClick()}>
            Add Family Member
          </Button>
        </Col>
      </FormGroup>
    </Row>
  );
}
