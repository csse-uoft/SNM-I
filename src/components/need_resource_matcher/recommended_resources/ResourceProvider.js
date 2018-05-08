import React, { Component } from 'react';
import Resource from './Resource.js';
import _ from 'lodash';

export default class ResourceProvider extends Component {
  render() {  
    const p = this.props;
    return(
      <li className='provider'>
        <div className='contact-info'>
          <span className='full-name'>{p.provider.first_name} {p.provider.last_name}</span><br />
          <span className='email'>{p.provider.email} </span>
        </div>
        <div className='resources'>
          <ul>
            {
              p.provider.resources.map((r) => { 
                let matchState = this.matchStateForResource(r.id);
                return (
                  <Resource key={r.id} resource={r} saveMatchState={p.saveMatchState} 
                    deleteMatchState={p.deleteMatchState} matchState={matchState} />
                )
              })
            }
          </ul>
        </div>
      </li>
    )
  }

  matchStateForResource = (resourceId) => {
    const resource =  _.find(this.props.matchedResources, r => r.resource.id === resourceId);
    let state = undefined;
    if (resource) {
      state = 'matched';
      state = resource.pending ? 'pending' : state;
      state = resource.fulfilled ? 'fulfilled' : state;
    } 
    return state;
  }
}