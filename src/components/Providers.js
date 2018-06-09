import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './providers/ProvidersIndex.js'
import ProviderRow from './providers/ProviderRow.js'

// redux
import { connect } from 'react-redux'
import { searchProviders, fetchProviders, createProvider, updateProvider, deleteProvider } from '../store/actions/providerActions.js'
// styles
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';

class Providers extends Component {
  constructor(props) {
    super(props);
    this.deleteProvider=this.deleteProvider.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchProviders());
  }

  deleteProvider(id) {
    this.props.dispatch(deleteProvider(id));
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
        { p.providersLoaded &&
          <ProvidersIndex> {
            p.providers.map((provider) => {
              return <ProviderRow key={ provider.id } provider={ provider }
                      delete={this.deleteProvider} />
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
