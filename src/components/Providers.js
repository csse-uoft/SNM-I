import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './providers/ProvidersIndex.js'
import ProviderRow from './providers/ProviderRow.js'
import CSVUploadModal from './shared/CSVUploadModal'

import { providerFormTypes } from '../constants/provider_fields.js'

// redux
import { connect } from 'react-redux'
import { fetchProviders, createProviderWithCSV } from '../store/actions/providerActions.js'
import { fetchNeeds } from '../store/actions/needActions.js'
import { formatLocation } from '../helpers/location_helpers.js';
import ProviderSearchBar from './providers/ProviderSearchBar';

// styles
import { Button, Col, Glyphicon, Pagination, DropdownButton, MenuItem } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";

class MapMarker extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      isClicked: false
    }
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.closeInfoBox = this.closeInfoBox.bind(this);
    this.openInfoBox = this.openInfoBox.bind(this);
  }

  onMouseEnter() {
    this.setState({
      isOpen: true
    })
  }

  onMouseLeave() {
    this.setState({
      isOpen: false
    })
  }

  closeInfoBox() {
    this.setState({
      isClicked: false
    })
  }

  openInfoBox() {
    this.setState({
      isClicked: true
    })
  }

  render() {
    if (this.props.provider.main_address) {
      return (
        <Marker
          key={this.props.provider.id}
          position={this.props.provider.main_address.lat_lng}
          onMouseOver={() => this.onMouseEnter()}
          onMouseOut={() => this.onMouseLeave()}
          onClick={this.openInfoBox}
        >
        {(this.state.isOpen || this.state.isClicked) &&
          <InfoWindow onCloseClick={() => this.closeInfoBox()}>
            <ProviderInfoBox provider={this.props.provider}/>
          </InfoWindow>
        }
        </Marker>
      )
    } else {
      return null
    }
  }

}

class ProviderInfoBox extends Component {
  render() {
    const provider = this.props.provider;
    return(
      <div>
        <div> {this.props.provider.type === "Individual" ?
          <text>
            <b>Provider name: </b>
            {<Link to={`/provider/${provider.id}`}>
              {this.props.provider.first_name + " " + this.props.provider.last_name}
            </Link>}
          </text> :
          <text>
            <b>Company: </b>
            {<Link to={`/provider/${provider.id}`}>
              {this.props.provider.company}
            </Link>}
          </text>}
        </div>
        <div>
          <text>
            <b>Provider address: </b>
            {formatLocation(provider.main_address).split(",").map(line => <div key={line}> {line} </div>)}
          </text>
        </div>
      </div>
    )
  }
}


class Providers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredProviders: this.props.providers,
      CSVModalshow: false,
      numberPerPage: 10,
      currentPage: 1,
      searchText: '',
      searchType: 'name',
      searchProviderType: 'all',
      selectedCategories: []
    }
    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeNumberPerPage = this.changeNumberPerPage.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleProviderTypeChange = this.handleProviderTypeChange.bind(this);
    this.handleCategorySelection = this.handleCategorySelection.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this)
  }

  componentWillMount() {
    this.props.dispatch(fetchProviders());
    this.props.dispatch(fetchNeeds());
  }

  handleInput(event) {
    const value = event.target.value;
    this.setState({ searchText: value});
    this.handleSearchChange(value, this.state.searchType, this.state.searchProviderType, this.state.selectedCategories)
  }

  handleTypeChange(event) {
    const value = event.target.value;
    this.setState({searchType: value});
    this.handleSearchChange(this.state.searchText, value, this.state.searchProviderType, this.state.selectedCategories)
  }

  handleProviderTypeChange(event) {
    const value = event.target.value;
    console.log(value)
    this.setState({searchProviderType: value});
    this.handleSearchChange(this.state.searchText, this.state.searchType, value, this.state.selectedCategories)
  }

  handleCategorySelection(event) {
    this.setState({selectedCategories: event});
    this.handleSearchChange(this.state.searchText, this.state.searchType, this.state.searchProviderType, event)
  }

  handleSearchChange(searchText, searchType, providerType, categories) {
    let providers;
    if (categories.length > 0) {
      providers = [];
      categories.forEach(category => {
        if (this.props.providersByService[category.value]) {
          providers = providers.concat(this.props.providersByService[category.value])
        }
      });
    } else {
      providers = this.props.providers;
    }

    if (searchText && searchType === "name") {
      providers = providers.filter(provider => (((provider.first_name).includes(searchText) ||
            (provider.last_name).includes(searchText) || (provider.company).includes(searchText))));
    } else if (searchText && searchType === "email") {
      providers = providers.filter(provider => (provider.email).includes(searchText));
    } else if (searchText && searchType === "phone") {
      providers = providers.filter(provider =>
        (provider.primary_phone_number).includes(searchText)
      );
    }

    if (providerType !== "all") {
      providers = providers.filter(provider => provider.type === providerType);
    }
    this.setState({filteredProviders: providers})
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.providers !== prevProps.providers) {
      this.setState({currentPage: 1});
    }
  }
  handleCSVModalHide() {
    this.setState({ CSVModalshow: false });
  }

  handleCSVModalShow() {
    this.setState({ CSVModalshow: true })
  }

  handleSubmit(e) {
    const file = document.querySelector('input[type="file"]').files[0];
    this.props.dispatch(createProviderWithCSV(file)).then(() =>
        this.setState({ CSVModalshow: false })
    );
  }

  changePage(e) {
    this.setState({currentPage: Number(e.target.text)});
  }

  changeNumberPerPage(e) {
    if (e.target.value === 'all') {
      this.setState({
        numberPerPage: this.props.providers.length,
        currentPage: 1
      });
    }
    else {
      this.setState({
        numberPerPage: e.target.value,
        currentPage: 1
      });
    }
  }

  render() {
    const p = this.props;
    let providersOnPage = this.state.filteredProviders.slice(
      this.state.numberPerPage * (this.state.currentPage - 1),
      this.state.numberPerPage * this.state.currentPage);
    let pageNumbers = [];
    for (let number = 1; number <= Math.ceil(this.state.filteredProviders.length/this.state.numberPerPage); number++) {
      pageNumbers.push(
        <Pagination.Item
          key={number}
          active={number ===this.state.currentPage}
          onClick={this.changePage}>{number}
        </Pagination.Item>
      )
    }
    const torontoCentroid = { lat: 43.6870, lng: -79.4132 }

    const GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={torontoCentroid} >
        {
          _.map(providersOnPage, (provider) => {
            return <MapMarker key={provider.id} provider={provider}/>
          })
        }
      </GoogleMap>
    ));

    return(
      <div className="providers content">
        <h3 className="title">Providers</h3>
          <div>
            <Link to="/notifications">
              You have {p.needs.length} notification(s)
            </Link>
            <hr/>
            <DropdownButton
              id="provider-form-type-dropdown"
              bsStyle="default"
              title="Add new provider"
            >
              {_.map(providerFormTypes, (formType, value) =>
                <MenuItem
                  key={value}
                  eventKey={value}
                  href={`/providers/${value}/new`}
                >
                  {formType}
                </MenuItem>
              )}
            </DropdownButton>
            {' '}
            <Button bsStyle="default" onClick={this.handleCSVModalShow}>
              Add providers by uploading CSV
            </Button>
            {' '}
            <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
              <Glyphicon glyph="print" />
            </Button>
          </div>
          <hr/>
          <ProviderSearchBar
            changeNumberPerPage={this.changeNumberPerPage}
            handleInput={this.handleInput}
            handleTypeChange={this.handleTypeChange}
            handleProviderTypeChange={this.handleProviderTypeChange}
            handleCategorySelection={this.handleCategorySelection}
            selectedCategories={this.state.selectedCategories}
            searchValue={this.state.searchText}
          />
          <hr/>
        { p.providersLoaded &&
          <div>
            <ProvidersIndex changeNumberPerPage={this.changeNumberPerPage}>{
              providersOnPage.map((provider) => {
                return <ProviderRow key={ provider.id } provider={ provider } />
              })
            }
            </ProvidersIndex>
            <Pagination className="pagination">
              {pageNumbers}
            </Pagination>
          </div>
        }
        <hr/>
        { p.providersLoaded &&
        <div>
        <Col sm={4}>
          <div style={{width: '250%', height: '400px'}}>
            <GMap
              containerElement={
                <div style={{ height: `100%` }} />
              }
              mapElement={
                <div style={{ height: `100%` }} />
              }
            />
          </div>
        </Col>
        </div>
      }
        <CSVUploadModal
          show={this.state.CSVModalshow}
          onHide={this.handleCSVModalHide}
          submit={this.handleSubmit}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    needs: state.needs.needs,
    providers: state.providers.filteredProviders || [],
    providersByService: state.providers.providersByService,
    providersLoaded: state.providers.loaded
  }
}

export default connect(
  mapStateToProps
)(Providers);
