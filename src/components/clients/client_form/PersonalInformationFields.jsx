import React from 'react';
import FormField from '../../shared/FormField'
import SelectField from '../../shared/SelectField'
import { genderOptions, maritalStatusOptions } from '../../../store/defaults.js';
import { FormGroup, ControlLabel, Col, Row, Radio} from 'react-bootstrap';

export default function PersonalInformationFields({ handleFormValChange, ...props }) {
  return (
    <Row>
      <FormField
        id="first_name"
        label="First name"
        type="text"
        value={props.first_name}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="middle_name"
        label="Middle name"
        type="text"
        value={props.middle_name}
        onChange={handleFormValChange}
      />
      <FormField
        id="last_name"
        label="Last name"
        type="text"
        value={props.last_name}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="preferred_name"
        label="Preferred Name"
        type="text"
        value={props.preferred_name}
        onChange={handleFormValChange}
      />
      <SelectField
        id="gender"
        label="Gender"
        options={genderOptions}
        componentClass="select"
        value={props.gender}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="birth_date"
        label="Date of Birth"
        type="date"
        value={props.birth_date}
        onChange={handleFormValChange}
        required
      />
      <SelectField
        id="marital_status"
        label="Marital Status"
        options={maritalStatusOptions}
        componentClass="select"
        value={props.marital_status}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        value={props.email}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="primary_phone_number"
        label="Telephone"
        type="tel"
        value={props.primary_phone_number}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="alt_phone_number"
        label="Alternative Phone Number"
        type="tel"
        value={props.alt_phone_number}
        onChange={handleFormValChange}
      />
      <FormField
        id="apt_number"
        label="Apt. #"
        type="text"
        value={props.address.apt_number}
        onChange={handleFormValChange}
      />
      <FormField
        id="street_address"
        label="Street Address"
        type="text"
        value={props.address.street_address}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="city"
        label="City"
        type="text"
        value={props.address.city}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="province"
        label="Province"
        type="text"
        value={props.address.province}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="postal_code"
        label="Postal Code"
        type="text"
        value={props.address.postal_code}
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
            defaultChecked={props.has_children === true}
            inline
          >
            Yes
          </Radio>{' '}
          <Radio
            name="radioGroup"
            value='false'
            onChange={e => handleFormValChange(e, 'has_children')}
            defaultChecked={props.has_children === false}
            inline
          >
            No
          </Radio>{' '}
        </Col>
      </FormGroup>
      {JSON.parse(props.has_children) && (
        <FormField
          id="num_of_children"
          label="Number of Children"
          type="number"
          value={props.num_of_children}
          onChange={handleFormValChange}
          required
        />
      )}
    </Row>
  );
}
