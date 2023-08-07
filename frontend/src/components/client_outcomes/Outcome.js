import React, { Component } from 'react';
import TR from '../shared/TR';

import { torontoCoordinates, serverHost } from '../../store/defaults.js';

import MatchedServices from './MatchedServices';
import ServiceList from './ServiceList';
import ServiceSearchBar from './ServiceSearchBar';

// redux
import { connect } from 'react-redux'
import { fetchOutcome } from '../../store/actions/outcomeActions.js'

import { Container, Row, Col, Table, Tabs, Tab } from 'react-bootstrap';


class Outcome extends Component {
  constructor(props) {
    super(props);

    const outcome = props.outcomesById[props.match.params.outcome_id];
    this.state = {
      searchResult: [],
      location: props.client.address ? { lat: parseFloat(props.client.address.lat), lng: parseFloat(props.client.address.lng) }: torontoCoordinates,
      recommendedServices: (outcome && outcome.recommended_services) || []
    }

    this.handleSearchService = this.handleSearchService.bind(this);
    this.handleSearchRecommendedServices = this.handleSearchRecommendedServices.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.outcome_id
    this.props.dispatch(fetchOutcome(id, outcome => {
      this.setState({ recommendedServices: outcome.recommended_services })
    }));
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

  handleSearchRecommendedServices(location, outcomeId) {
    const url = serverHost + '/outcomes/' + outcomeId + '/recommended_services?location=' + location;
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
          id = p.match.params.outcome_id,
          outcome = p.outcomesById[id],
          client = p.client

    function DeletedLabel({ is_deleted }) {
      if (is_deleted) {
        return (
          <h4>
            <div style={{color: 'rgb(213,87,79)'}}>Deleted</div>
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
            <div style={{color: 'rgb(213,87,79)'}}>Urgent</div>
          </h4>
        );
      } else {
        return null;
      }
    }

    return (
      <Container className="content">
        { outcome && outcome.loaded &&
          <Row>
            <Col sm={12}>
              <h3>Outcome</h3>
            </Col>
            <Col sm={12}>
              <DeletedLabel is_deleted={outcome.is_deleted} />
              <UrgentLabel is_urgent={outcome.is_urgent} />
              <Table striped bordered condensed hover>
                <tbody>
                  <TR
                    title="Type"
                    value={outcome.type}
                  />
                  <TR
                    title="Category"
                    value={outcome.category}
                  />
                  <TR
                    title="Outcome For"
                    value={outcome.outcome_for}
                  />
                  <TR
                    title="Description"
                    value={outcome.description}
                  />
                  <TR
                    title="Condition"
                    value={outcome.condition}
                  />
                  <TR
                    title="Status"
                    value={outcome.status}
                  />
                  <TR
                    title="Languages"
                    value={(outcome.languages || []).join(', ')}
                  />
                </tbody>
              </Table>
            </Col>
            {(outcome.matches.length > 0) &&
              <MatchedServices
                clientId={client.id}
                matches={outcome.matches}
              />
            }
            <Col sm={12}>
              <Tabs defaultActiveKey={1} id="serviceList">
                <Tab eventKey={1} title="RecommendedServices">
                  <ServiceSearchBar
                    search={this.handleSearchRecommendedServices}
                    location={client.address}
                    outcomeId={outcome.id}
                  />
                  {outcome.recommended_services && outcome.recommended_services.length > 0 &&
                    <ServiceList
                      outcome={outcome}
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
                      outcome={outcome}
                      services={this.state.searchResult}
                      latlng={this.state.location}
                    />
                  }
                </Tab>
              </Tabs>
            </Col>
          </Row>
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    outcomesById: state.outcomes.byId,
    client: state.clients.byId[state.outcomes.clientId]
  }
}

export default connect(
  mapStateToProps
)(Outcome);
