import React, { Component } from 'react';
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';
import _ from 'lodash';
import { defaults } from '../../../store/defaults.js';

// components
import GenericResourceDetails from './resource/GenericResourceDetails.js'
import LanguageResourceDetails from './resource/LanguageResourceDetails.js'
import EmploymentMentorDetails from './resource/EmploymentMentorDetails.js'
import CustomToggle from '../../shared/CustomToggle.js';

export default class Resource extends Component {
  render() {
    const p = this.props,
          r = p.resource,
          DetailsComponent = this.detailsComponent();
    return (
      <li className="resource">
        <Dropdown id='match-menu' pullRight>
          <CustomToggle bsRole="toggle">
            {this.isMatchState('any') ?
              <Glyphicon glyph="asterisk" /> :
              <Glyphicon glyph="pushpin" /> 
            }
          </CustomToggle>
          <Dropdown.Menu>
            <MenuItem eventKey="1" onClick={this.matchResource}>
              <span className={this.isMatchState('matched') && 'current-state'}>Match</span>
            </MenuItem>
            <MenuItem eventKey="2" onClick={this.matchResourcePending}>
              <span className={this.isMatchState('pending') && 'current-state'}>Pending</span>
            </MenuItem>
            <MenuItem eventKey="3" onClick={this.matchResourceFulfilled}>
              <span className={this.isMatchState('fulfilled') && 'current-state'}>Fulfilled</span>
            </MenuItem>
            {this.isMatchState('any') && 
              <MenuItem eventKey="4" onClick={this.deleteMatchState}>
                Clear
              </MenuItem>
            }
          </Dropdown.Menu>
        </Dropdown>
        <h5>{this.getResourceLabelForType(r.type)}</h5>
        <DetailsComponent details={r.details} />
      </li>
    );
  }

  matchResource = () => {
    this.saveMatchState();
  }

  matchResourcePending = () => {
    this.saveMatchState(true);
  }

  matchResourceFulfilled = () => {
    this.saveMatchState(false, true);
  }

  saveMatchState = (pending=false, fulfilled=false) => {
    const p = this.props;
    p.saveMatchState(p.resource.id, pending, fulfilled)
  }

  deleteMatchState = () => {
    const p = this.props;
    p.deleteMatchState(p.resource.id);
  }

  isMatchState = (state) => {
    const matchState = this.props.matchState
    switch (state) {
      case 'any':
        return !_.isUndefined(matchState);
      default:
        return state === matchState;
    }
  }

  detailsComponent = () => {
    let Component;
    switch (this.props.resource.type) {
      case 'interpreter':
      case 'translator':
        Component = LanguageResourceDetails;
        break;
      case 'employment_mentor':
        Component = EmploymentMentorDetails;
        break;
      default:
        Component = GenericResourceDetails;
    }
    return Component;
  }

  getResourceLabelForType = (type) => {
    if (type === "") return "";
    const rtm = defaults.resourceTypeMap;
    const resource = _.find(rtm, r => { return r.value === type});
    return resource.label;
  }
}