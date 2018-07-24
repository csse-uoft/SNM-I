import React, { Component } from 'react';
import _ from 'lodash';

import RecommendedService from './RecommendedService'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

// redux
import { connect } from 'react-redux'
import { fetchNeed } from '../../store/actions/needActions.js'

import { Grid, Row, Col, Table, Label } from 'react-bootstrap';

class Need extends Component {
  componentWillMount() {
    const id = this.props.match.params.need_id
    this.props.dispatch(fetchNeed(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.need_id,
          need = p.needsById[id],
          client = p.client,
          latlng = client.personal_information.address.lat_lng,
          recommended_services = _.keyBy(need.recommended_services, service => service.id);
    let distances = []
    _.each(need.recommended_service_distances, (distance, serviceId) => {
      distances.push({id: serviceId, distance: distance})
    })
    const order = _.orderBy(distances, ['distance']);

    const GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={latlng} >
        {
          _.map(order, (service, index) => {
            return <Marker key={service.id}
                           position={recommended_services[service.id].location.lat_lng}
                           label={(index+1).toString()}
                   />
          })
        }
      </GoogleMap>
    ));

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
                  <tr>
                    <td><b>Type</b></td>
                    <td>{need.type}</td>
                  </tr>
                  <tr>
                    <td><b>Category</b></td>
                    <td>{need.category}</td>
                  </tr>
                  <tr>
                    <td><b>Needed by</b></td>
                    <td>{need.needed_by}</td>
                  </tr>
                  <tr>
                    <td><b>Description</b></td>
                    <td>{need.description}</td>
                  </tr>
                  {
                    (need.type === 'Good') && (
                      <tr>
                        <td><b>Condition</b></td>
                        <td>{need.condition}</td>
                      </tr>
                    )
                  }
                  <tr>
                    <td><b>Status</b></td>
                    <td>
                      {need.status}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <hr />
            <Col sm={12}>
              <h3>Recommended Services</h3>
            </Col>
            <Col sm={8}>
              {
                _.map(order, (service, index) => {
                  return (
                    <RecommendedService
                      label={index+1}
                      key={service.id}
                      service={recommended_services[service.id]}
                      need={need}
                      distance={service.distance}
                    />
                  )
                })
              }
            </Col>
            <Col sm={4}>
              <div style={{width: '100%', height: '400px'}}>
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
