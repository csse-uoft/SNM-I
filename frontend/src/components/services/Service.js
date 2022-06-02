import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TR from '../shared/TR'

// redux
import { connect } from 'react-redux'
import { fetchService } from '../../api/mockedApi/services'

import { formatLocation } from '../../helpers/location_helpers'
import { formatEligibilityConditions } from '../../helpers/eligibility_condition_helpers'

import { Table, Button } from 'react-bootstrap';
import { Print } from "@mui/icons-material";

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
          <Print fontSize="small"/>
        </Button>

        { service && service.servicesLoaded &&
          <Table striped bordered condensed hover>
            <tbody>
              <TR
                title="Name"
                value={service.name}
              />

              <TR
                title="Type"
                value={service.type}
              />
              <TR
                title="Description"
                value={service.desc}
              />
              <TR
                title="Category"
                value={service.category}
              />
              <TR
                title="Eligibility"
                value={service.eligibility}
              />
              <TR
                title="Available from"
                value={service.available_from}
              />
              <TR
                title="Available until"
                value={service.available_to}
              />
              <TR
                title="Languages"
                value={(service.languages || []).join(', ')}
              />
              <TR
                title="Max Capacity"
                value={service.max_capacity}
              />
              <TR
                title="Current capacity"
                value={service.current_capacity}
              />
              <TR
                title="Frequency"
                value={service.frequency}
              />
              <TR
                title="Billable"
                value={service.billable}
              />
              <TR
                title="Price"
                value={service.price}
              />
              <TR
                title="Method of delivery"
                value={service.method_of_delivery}
              />
              <TR
                title="Method of registration"
                value={service.method_of_registration}
              />
              <TR
                title="Registration"
                value={service.registration}
              />
              <TR
                title="Contact Person Email"
                value={service.email}
              />
              <TR
                title="Contact Person Phone"
                value={service.primary_phone_number}
              />
              <TR
                title="Secondary Phone"
                value={service.alt_phone_number}
              />
              <tr>
                <td><b>Location</b></td>
                <td>{formatLocation(service.location)}</td>
              </tr>

              {_.keys(_.omit(service.eligibility_conditions, ['lower_age_limit', 'upper_age_limit'])) > 0 &&
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
              <TR
                title="Public?"
                value={service.is_public ? 'Yes': 'No'}
              />
              <TR
                title="Share with"
                value={(service.share_with || []).join(', ')}
              />
              <TR
                title="Notes"
                value={service.notes}
              />
              <tr>
                <td><b>Provider</b></td>
                <td>
                  <Link to={`/provider/${service.provider.id}`}>
                    {(service.provider.type === 'Organization') ?
                      service.provider.company
                    :
                      `${service.provider.profile.first_name} ${service.provider.profile.last_name}`
                    }
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
