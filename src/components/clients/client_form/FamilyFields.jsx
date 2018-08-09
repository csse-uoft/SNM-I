import _ from 'lodash';
import React from 'react';
import FormField from '../../shared/FormField'
import SelectField from '../../shared/SelectField'
import { genderOptions, familyRelationshipOptions } from '../../../store/defaults.js';
import { FormGroup, FormControl, ControlLabel, Col, Row, Button } from 'react-bootstrap';

function FamilyMemberFields({ index,
                              clientId,
                              member,
                              handleFormValChange,
                              handleRemoveFamilyButtonClick }) {
  const count = index + 1;
  return (
    <div>
      <FormGroup controlId="first_name">
        <Col componentClass={ControlLabel} sm={3}>
          Family Member #{count}
        </Col>
        <Col sm={8}>
          <FormControl
            type="text"
            onChange={e => handleFormValChange(e, index)}
            value={member.person.first_name}
            placeholder="First name"
            disabled={clientId && member.person.id === clientId}
          />
        </Col>
        <Col sm={1}>
          <Button
            bsStyle="danger"
            bsSize="small"
            disabled={clientId && member.person.id === clientId}
            onClick={e => handleRemoveFamilyButtonClick(index)}
          >
            Remove
          </Button>
        </Col>
      </FormGroup>
      <FormField
        id="last_name"
        type="text"
        value={member.person.last_name}
        onChange={e => handleFormValChange(e, index)}
        placeholder="Last name"
        disabled={clientId && member.person.id === clientId}
      />
      <FormField
        id="birth_date"
        type="date"
        value={member.person.birth_date}
        onChange={e => handleFormValChange(e, index)}
        disabled={clientId && member.person.id === clientId}
      />
      <SelectField
        id="gender"
        options={genderOptions}
        componentClass="select"
        value={member.person.gender}
        onChange={e => handleFormValChange(e, index)}
        defaultOptionTitle="Gender"
        disabled={clientId && member.person.id === clientId}
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

export default function FamilyFields({ family,
                                       clientId,
                                       handleFormValChange,
                                       handleAddFamilyButtonClick,
                                       handleRemoveFamilyButtonClick,
                                       clientFormFields }) {
  return (
    <div>
      {_.map(family.members, (member, index) => {
        return (
          <FamilyMemberFields
            key={index}
            index={index}
            member={member}
            clientId={clientId}
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
    </div>
  );
}
