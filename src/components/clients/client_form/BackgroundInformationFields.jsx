import React, { Component } from 'react';
import FormField from '../../shared/FormField'
import SelectField from '../../shared/SelectField'
import CheckboxField from '../../shared/CheckboxField'
import { statusInCanadaOptions, educationLevelOptions,
         incomeSourceOptions } from '../../../store/defaults.js';
import { FormGroup, ControlLabel, Col, Row } from 'react-bootstrap';

export default class BackgroundInformationFields extends Component {
  render() {
    return (
      <Row>
        <SelectField
          id="status_in_canada"
          label="Status In Canada"
          options={statusInCanadaOptions}
          componentClass="select"
          value={this.props.status_in_canada}
          onChange={this.props.formValChange}
        />
        <FormField
          id="country_of_origin"
          label="Country of Origin"
          type="text"
          value={this.props.country_of_origin}
          onChange={this.props.formValChange}
        />
        <FormField
          id="country_of_last_residence"
          label="Country of Last Residence"
          type="text"
          value={this.props.country_of_last_residence}
          onChange={this.props.formValChange}
        />
        <SelectField
          id="first_language"
          label="First Language"
          options={this.props.languagesCategories}
          componentClass="select"
          value={this.props.first_language}
          onChange={this.props.formValChange}
        />
        <CheckboxField
          id="other_languages"
          label="Other languages"
          options={this.props.languagesCategories.filter(category => category !== this.props.first_language)}
          checkedOptions={this.props.other_languages}
          handleFormValChange={this.props.formValChange}
        />
        <FormField
          id="pr_number"
          label="Permanent Residence Card Number (PR card)"
          type="text"
          value={this.props.pr_number}
          onChange={this.props.formValChange}
        />
        <FormField
          id="immigration_doc_number"
          label="Immigration Document Number (if different from PR card)"
          type="text"
          value={this.props.immigration_doc_number}
          onChange={this.props.formValChange}
        />
        <FormField
          id="landing_date"
          label="Landing Date"
          type="date"
          value={this.props.landing_date}
          onChange={this.props.formValChange}
        />
        <FormField
          id="arrival_date"
          label="Arrival Date (if different from landing_date)"
          type="date"
          value={this.props.arrival_date}
          onChange={this.props.formValChange}
        />
        <SelectField
          id="level_of_education"
          label="Level of education"
          options={educationLevelOptions}
          componentClass="select"
          value={this.props.level_of_education}
          onChange={this.props.formValChange}
        />
        <SelectField
          id="income_source"
          label="Income Source"
          options={incomeSourceOptions}
          componentClass="select"
          value={this.props.income_source}
          onChange={this.props.formValChange}
        />
        <FormField
          id="num_of_dependants"
          label="Number of Dependants"
          type="number"
          value={this.props.num_of_dependants}
          onChange={this.props.formValChange}
        />
        <CheckboxField
          id="eligibilities"
          label="Eligibilities"
          options={this.props.eligibility_criteria || []}
          checkedOptions={this.props.eligibilities}
          handleFormValChange={this.props.formValChange}
        />
      </Row>
    );
  }
}
