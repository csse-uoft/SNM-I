import React, { Component } from 'react';
import ResourceProvider from './recommended_resources/ResourceProvider.js';

export default class RecommendedResources extends Component {

  render() {
    const p = this.props;
    return (
      <div>
        <ul className='provider-resources'>
          {p.resourcesByProvider.map((provider) => { 
            return <ResourceProvider key={provider.id} provider={provider} 
              saveMatchState={p.saveMatchState} deleteMatchState={p.deleteMatchState}
              matchedResources={p.matchedResources} />
          })}
        </ul>
      </div>
    )
  }
}