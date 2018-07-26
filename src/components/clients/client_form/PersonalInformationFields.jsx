import React from 'react';
import FormField from '../../shared/FormField'
import SelectField from '../../shared/SelectField'
import { genderOptions, maritalStatusOptions } from '../../../store/defaults.js';
import { FormGroup, FormControl, ControlLabel, Col, Row, Radio} from 'react-bootstrap';

export default function PersonalInformationFields({ person, handleFormValChange }) {
  return (
    <Row>
      <FormField
        id="first_name"
        label="First name"
        type="text"
        value={person.first_name}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="middle_name"
        label="Middle name"
        type="text"
        value={person.middle_name}
        onChange={handleFormValChange}
      />
      <FormField
        id="last_name"
        label="Last name"
        type="text"
        value={person.last_name}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="preferred_name"
        label="Preferred Name"
        type="text"
        value={person.preferred_name}
        onChange={handleFormValChange}
      />
      <SelectField
        id="gender"
        label="Gender"
        options={genderOptions}
        componentClass="select"
        value={person.gender}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="birth_date"
        label="Date of Birth"
        type="date"
        value={person.birth_date}
        onChange={handleFormValChange}
        required
      />
      <SelectField
        id="marital_status"
        label="Marital Status"
        options={maritalStatusOptions}
        componentClass="select"
        value={person.marital_status}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        value={person.email}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="primary_phone_number"
        label="Telephone"
        type="tel"
        value={person.primary_phone_number}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="alt_phone_number"
        label="Alternative Phone Number"
        type="tel"
        value={person.alt_phone_number}
        onChange={handleFormValChange}
      />
      <FormField
        id="apt_number"
        label="Apt. #"
        type="text"
        value={person.address.apt_number}
        onChange={handleFormValChange}
      />
      <FormField
        id="street_address"
        label="Street Address"
        type="text"
        value={person.address.street_address}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="city"
        label="City"
        type="text"
        value={person.address.city}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="province"
        label="Province"
        type="text"
        value={person.address.province}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="postal_code"
        label="Postal Code"
        type="text"
        value={person.address.postal_code}
        onChange={handleFormValChange}
        required
      />
      <FormGroup controlId="has_children">
        <Col className="required" componentClass={ControlLabel} sm={3}>
          Do you have children?
        </Col>
        <Col sm={9}>
          <Radio
            name="radioGroup"
            value='true'
            onChange={e => handleFormValChange(e, 'has_children')}
            defaultChecked={person.has_children === true}
            inline
          >
            Yes
          </Radio>{' '}
          <Radio
            name="radioGroup"
            value='false'
            onChange={e => handleFormValChange(e, 'has_children')}
            defaultChecked={person.has_children === false}
            inline
          >
            No
          </Radio>{' '}
        </Col>
      </FormGroup>
      {JSON.parse(person.has_children) && (
        <FormField
          id="num_of_children"
          label="Number of Children"
          type="number"
          value={person.num_of_children}
          onChange={handleFormValChange}
          required
        />
      )}
    </Row>
  );
}
