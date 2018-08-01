import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux'
import { fetchService } from '../../store/actions/serviceActions.js'

import { formatLocation } from '../../helpers/location_helpers'
import { formatEligibilityConditions } from '../../helpers/eligibility_condition_helpers'

import { Table, Glyphicon, Button } from 'react-bootstrap';

class Service extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchService(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.id,
          service = p.servicesById[id];

    return (
      <div className="content client">
        <h3>Service Profile</h3>
        <Link to={`/services/${service.id}/edit`}>
          <Button bsStyle="primary">
            Edit
          </Button>
        </Link>{' '}
        <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
          <Glyphicon glyph="print" />
        </Button>

        { service && service.servicesLoaded &&
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td><b>Name</b></td>
                <td>{service.name}</td>
              </tr>
              <tr>
                <td><b>Type</b></td>
                <td>{service.type}</td>
              </tr>
              <tr>
                <td><b>Description</b></td>
                <td>{service.desc}</td>
              </tr>
              <tr>
                <td><b>Category</b></td>
                <td>{service.category}</td>
              </tr>
              <tr>
                <td><b>Eligibility</b></td>
                <td>{service.eligibility}</td>
              </tr>
              <tr>
                <td><b>Available from</b></td>
                <td>{service.available_from}</td>
              </tr>
              <tr>
                <td><b>Available until</b></td>
                <td>{service.available_to}</td>
              </tr>
              <tr>
                <td><b>Language</b></td>
                <td>{service.language}</td>
              </tr>
              <tr>
                <td><b>Capacity</b></td>
                <td>{service.capacity}</td>
              </tr>
              <tr>
                <td><b>Available capacity</b></td>
                <td>{service.available_capacity}</td>
              </tr>
              <tr>
                <td><b>Frequency</b></td>
                <td>{service.frequency}</td>
              </tr>
              <tr>
                <td><b>Billable</b></td>
                <td>{service.billable}</td>
              </tr>
              <tr>
                <td><b>Price</b></td>
                <td>{service.price}</td>
              </tr>
              <tr>
                <td><b>Method of delivery</b></td>
                <td>{service.method_of_delivery}</td>
              </tr>
              <tr>
                <td><b>Method of registration</b></td>
                <td>{service.method_of_registration}</td>
              </tr>
              <tr>
                <td><b>Registration</b></td>
                <td>{service.registration}</td>
              </tr>
              <tr>
                <td><b>Contact Person Email</b></td>
                <td>{service.email}</td>
              </tr>
              <tr>
                <td><b>Contact Person Phone</b></td>
                <td>{service.primary_phone_number}</td>
              </tr>
              <tr>
                <td><b>Secondary Phone</b></td>
                <td>{service.alt_phone_number}</td>
              </tr>
              <tr>
                <td><b>Location</b></td>
                <td>{formatLocation(service.location)}</td>
              </tr>

              {service.eligibility_conditions &&
              <tr>
                <td><b>Eligibility Conditions</b></td>
                <td>
                  {_.map(
                      _.omit(service.eligibility_conditions, ['lower_age_limit', 'upper_age_limit']
                    ), (value, type) => {
                    return (
                      <li key={type}>
                        {formatEligibilityConditions(type, value)}
                      </li>
                    );
                  })}
                  {service.eligibility_conditions.lower_age_limit &&
                    <li>
                      {formatEligibilityConditions('Age greater than' , service.eligibility_conditions.lower_age_limit)}
                    </li>
                  }
                  {service.eligibility_conditions.upper_age_limit &&
                    <li>
                      {formatEligibilityConditions('Age less than' , service.eligibility_conditions.upper_age_limit)}
                    </li>
                  }
                </td>
              </tr>
              }

              <tr>
                <td><b>Share with</b></td>
                <td>{service.share_with}</td>
              </tr>
              <tr>
                <td><b>Notes</b></td>
                <td>{service.notes}</td>
              </tr>
              <tr>
                <td><b>Provider</b></td>
                <td>
                  <Link to={`/provider/${service.provider.id}`}>
                    {`${service.provider.first_name} ${service.provider.last_name}`}
                  </Link>
                </td>
              </tr>
            </tbody>
          </Table>
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    servicesById: state.services.byId,
    serviceLoaded: state.services.indexLoaded 
  }  
}

export default connect(
  mapStateToProps
)(Service);
