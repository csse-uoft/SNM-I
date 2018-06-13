import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './providers/ProvidersIndex.js'
import ProviderRow from './providers/ProviderRow.js'

// redux
import { connect } from 'react-redux'
import { fetchProviders } from '../store/actions/providerActions.js'
// styles
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';

class Providers extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchProviders());
  }

  render() {
    const p = this.props, s = this.state;
    return(
      <div className='providers content'>
        <h3 className='title'>Providers</h3>
          <div>
            <Link to={`/providers/new/upload`}>
              <Button bsStyle="default" >
              Upload from CSV
              </Button>
            </Link>
            <Link to={`/providers/new`}>
              <Button bsStyle="default" >
              Add new provider
              </Button>
            </Link>
          </div>
          <hr/>
        { p.providersLoaded &&
          <ProvidersIndex>{
            p.providers.map((provider) => {
              return <ProviderRow key={ provider.id } provider={ provider } />
            })
          }
          </ProvidersIndex>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    providers: state.providers.filteredProviders || [], //array of json 
    providersLoaded: state.providers.loaded
  }
}

export default connect(
  mapStateToProps
)(Providers);
