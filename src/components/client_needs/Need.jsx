import React, { Component } from 'react';
import _ from 'lodash';
import TableRow from '../shared/TableRow'

import { torontoCoordinates, serverHost } from '../../store/defaults.js';

import MatchedServices from './MatchedServices'
import RecommendedServices from './RecommendedServices'
import ServiceSearchBar from './ServiceSearchBar'

// redux
import { connect } from 'react-redux'
import { fetchNeed } from '../../store/actions/needActions.js'

import { Grid, Row, Col, Table, Label, Tabs, Tab } from 'react-bootstrap';

class Need extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBy: '',
      queryTerm: '',
      searchResult: []
    }

    this.handleSearchService = this.handleSearchService.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.need_id
    this.props.dispatch(fetchNeed(id));
  }

  handleSearchService(searchBy, queryTerm) {
    const url = serverHost + '/services/search?search_by=' + searchBy + '&query_term=' + queryTerm;
    fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }),
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ searchResult: data })
      }
    );
  }

  render() {
    const p = this.props,
          id = p.match.params.need_id,
          need = p.needsById[id],
          client = p.client,
          latlng = client.address ? client.address.lat_lng : torontoCoordinates;

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
                </tbody>
              </Table>
            </Col>
            {(need.matches.length > 0) &&
              <MatchedServices matches={need.matches} />
            }
            <Col sm={12}>
              <Tabs defaultActiveKey={1} id="serviceList">
                <Tab eventKey={1} title="RecommendedServices">
                  {need.recommended_services && need.recommended_services.length > 0 &&
                    <RecommendedServices
                      need={need}
                      recommended_services={need.recommended_services}
                      latlng={latlng}
                    />
                  }
                </Tab>
                <Tab eventKey={2} title="Search for Services">
                  <ServiceSearchBar
                    search={this.handleSearchService}
                  />
                  {this.state.searchResult && this.state.searchResult.length > 0 &&
                    <RecommendedServices
                      need={need}
                      recommended_services={this.state.searchResult}
                      latlng={latlng}
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
