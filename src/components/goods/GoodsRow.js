import React, { Component } from 'react';
import { defaults } from '../../store/defaults.js';
import _ from 'lodash';

// components
//import GenericResourceDetails from './resource_row/GenericResourceDetails.js'
//import LanguageResourceDetails from './resource_row/LanguageResourceDetails.js'
//import EmploymentMentorDetails from './resource_row/EmploymentMentorDetails.js'
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';
import CustomToggle from '../shared/CustomToggle.js';

export default class GoodsRow extends Component {
  render() {
    const r = this.props.good
    const a = r.imagelink
    return(
      <tr>
        <td>
          {this.getGoodLabelForType(r.type)}
        </td>
        <td className='centered-text'>
          {r.description} 
        </td>
        <td className='centered-text'>
          {this.getGoodLabelForCondition(r.condition)}
        </td>
        <td className='centered-text'>
          {r.contactinfo}
        </td>
        <td className='centered-text'>
         <a href= {a} target='_blank'>
            View
         </a>
        </td>
        <td>
          <Dropdown id='action-menu' pullRight>
          <CustomToggle bsRole="toggle">
            <Glyphicon glyph="option-vertical" /> 
          </CustomToggle>
          <Dropdown.Menu>
            <MenuItem eventKey="1" onClick={this.update}>
              <span>Update</span>
            </MenuItem>
            <MenuItem eventKey="2" onClick={this.delete}>
              <span>Delete</span>
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        </td>
      </tr>
    )
  }

  delete = () => {
    const p = this.props;
    p.delete(p.good.id);
  }

  update = () => {
    const p = this.props;
    p.showUpdateModal(p.good);
  }

  getGoodLabelForCondition = (condition) => {
    if (condition === "") return "";
    const rtm = defaults.conditionTypeMap;
    const good = _.find(rtm, r => {return r.value === condition});
    console.log(good)
    return good.label;
  }

  getGoodLabelForType = (type) => {
    if (type === "") return "";
    const rtm = defaults.goodsTypeMap;
    const good = _.find(rtm, r => {return r.value === type});
    console.log(good)
    return good.label;
  }
}