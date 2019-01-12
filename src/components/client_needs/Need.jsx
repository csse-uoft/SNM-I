import React, { Component } from 'react';
import _ from 'lodash';
import TableRow from '../shared/TableRow';

import { torontoCoordinates, serverHost } from '../../store/defaults.js';

import MatchedServices from './MatchedServices'
import ServiceList from './ServiceList'
import ServiceSearchBar from './ServiceSearchBar'

// redux
import { connect } from 'react-redux'
import { fetchNeed } from '../../store/actions/needActions.js'

import { Grid, Row, Col, Table, Label, Tabs, Tab, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';

class Need extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResult: [],
      location: props.client.address ? props.client.address.lat_lng : torontoCoordinates,
      recommendedServices: props.needsById[props.match.params.need_id].recommended_services
    }

    this.handleSearchService = this.handleSearchService.bind(this);
    this.handleSearchRecommendedServices = this.handleSearchRecommendedServices.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.need_id
    this.props.dispatch(fetchNeed(id));
  }

  handleSearchService(queryTerm, location) {
    const url = serverHost + '/services/search?query_term=' + queryTerm + '&location=' + location;
    fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }),
      })
      .then(response => response.json())
      .then(json => {
        this.setState({ searchResult: json.data, location: json.location })
      }
    );
  }

  handleSearchRecommendedServices(location, needId) {
    const url = serverHost + '/needs/' + needId + '/recommended_services?location=' + location;
    fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }),
      })
      .then(response => response.json())
      .then(json => {
        this.setState({ recommendedServices: json.data, location: json.location })
      }
    );
  }

  render() {
    const p = this.props,
          id = p.match.params.need_id,
          need = p.needsById[id],
          client = p.client

    function DeletedLabel({ is_deleted }) {
      if (is_deleted) {
        return (
          <h4>
            <Label bsStyle="danger">Deleted</Label>
          </h4>
        );
      } else {
        return null;
      }
    }

    function UrgentLabel({ is_urgent }) {
      if (is_urgent) {
        return (
          <h4>
            <Label bsStyle="danger">Urgent</Label>
          </h4>
        );
      } else {
        return null;
      }
    }

    return (
      <Grid className="content">
        { need && need.loaded &&
          <Row>
            <Col sm={12}>
              <h3>Need</h3>
            </Col>
            <Col sm={12}>
              <DeletedLabel is_deleted={need.is_deleted} />
              <UrgentLabel is_urgent={need.is_urgent} />
              <Table striped bordered condensed hover>
                <tbody>
                  <TableRow
                    title="Type"
                    value={need.type}
                  />
                  <TableRow
                    title="Category"
                    value={need.category}
                  />
                  <TableRow
                    title="Needed By"
                    value={need.needed_by}
                  />
                  <TableRow
                    title="Description"
                    value={need.description}
                  />
                  <TableRow
                    title="Condition"
                    value={need.condition}
                  />
                  <TableRow
                    title="Status"
                    value={need.status}
                  />
                  <TableRow
                    title="Languages"
                    value={(need.languages || []).join(', ')}
                  />
                </tbody>
              </Table>
            </Col>
            {(need.matches.length > 0) &&
              <MatchedServices matches={need.matches} />
            }
            <Col sm={12}>
              <Tabs defaultActiveKey={1} id="serviceList">
                <Tab eventKey={1} title="RecommendedServices">
                  <ServiceSearchBar
                    search={this.handleSearchRecommendedServices}
                    location={client.address}
                    needId={need.id}
                  />
                  {need.recommended_services && need.recommended_services.length > 0 &&
                    <ServiceList
                      need={need}
                      services={this.state.recommendedServices}
                      latlng={this.state.location}
                    />
                  }
                </Tab>
                <Tab eventKey={2} title="Search for Services">
                  <ServiceSearchBar
                    search={this.handleSearchService}
                    location={client.address}
                    enableQueryTerm
                  />
                  {this.state.searchResult && this.state.searchResult.length > 0 &&
                    <ServiceList
                      need={need}
                      services={this.state.searchResult}
                      latlng={this.state.location}
                    />
                  }
                </Tab>
              </Tabs>
            </Col>
          </Row>
        }
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    needsById: state.needs.byId,
    client: state.clients.byId[state.needs.clientId]
  }
}

export default connect(
  mapStateToProps
)(Need);
