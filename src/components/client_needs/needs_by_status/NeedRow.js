import React, { Component } from 'react';
import { Button,Glyphicon } from 'react-bootstrap';
import { defaults } from '../../../store/defaults.js';

// components
import GenericResourceRequirements from './need_row/GenericResourceRequirements.js';
import LanguageResourceRequirements from './need_row/LanguageResourceRequirements.js';
import EmploymentMentoreRequirements from './need_row/EmploymentMentoreRequirements.js';
import { Star } from './StarRating';

// utilities
import _ from 'lodash';
import moment from 'moment';

export default class NeedRow extends Component {
  render() {
    const n = this.props.need,
          RequirementsComponent = this.requirementsComponent();

    return(
      <tr className='need'>
        <td onClick={this.showSearchModal}>
          {this.getResourceLabelForType(n.type)}
        </td>
        <td className='centered-text' onClick={this.showSearchModal}>
          {!_.isEmpty(n.requirements) &&
            <RequirementsComponent requirements={n.requirements} />
          }
        </td>
        <td onClick={this.showSearchModal}>
          {moment(n.created_at).format('MMMM Do YYYY, h:mm a')}
        </td>
        <td>
          <Glyphicon glyph="glyphicon glyphicon-remove" onClick={this.deleteNeed} />
        </td>
        <td>
          <Star style={{display: 'inline-block'}}/>
        </td>        
        <td>
          <Button >Submit</Button>
        </td>
      </tr>
    )
  }

  deleteNeed = (e) => {
    e.stopPropagation();
    const p = this.props;
    p.delete(p.need.id);
  }

  showSearchModal = () => {
    const p = this.props,
          activeModalTab = _.isEmpty(p.need.resources) ? 1 : 2;
    p.showSearchModal(p.need.id, activeModalTab);
  }

  requirementsComponent = () => {
    let Component;
    switch (this.props.need.type) {
      case 'interpreter':
      case 'translator':
        Component = LanguageResourceRequirements;
        break;
      case 'employment_mentor':
        Component = EmploymentMentoreRequirements;
        break;
      default:
        Component = GenericResourceRequirements;
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