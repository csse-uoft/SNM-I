import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TR from '../shared/TR'

// redux
import { connect } from 'react-redux'
import { fetchProgram } from '../../api/mockedApi/programs'

import { formatLocation } from '../../helpers/location_helpers'
import { formatEligibilityConditions } from '../../helpers/eligibility_condition_helpers'

import { Table, Button } from 'react-bootstrap';
import { Print } from "@mui/icons-material";

class Program extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchProgram(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.id,
          program = p.programsById[id];

    return (
      <div className="content client">
        <h3>Program Profile</h3>
        <Link to={`/programs/${program.id}/edit`}>
          <Button bsStyle="primary">
            Edit
          </Button>
        </Link>{' '}
        <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
          <Print fontSize="small"/>
        </Button>

        { program && program.programsLoaded &&
          <Table striped bordered condensed hover>
            <tbody>
              <TR
                title="Name"
                value={program.name}
              />

              <TR
                title="Type"
                value={program.type}
              />
              <TR
                title="Description"
                value={program.desc}
              />
              <TR
                title="Category"
                value={program.category}
              />
              <TR
                title="Eligibility"
                value={program.eligibility}
              />
              <TR
                title="Available from"
                value={program.available_from}
              />
              <TR
                title="Available until"
                value={program.available_to}
              />
              <TR
                title="Languages"
                value={(program.languages || []).join(', ')}
              />
              <TR
                title="Max Capacity"
                value={program.max_capacity}
              />
              <TR
                title="Current capacity"
                value={program.current_capacity}
              />
              <TR
                title="Frequency"
                value={program.frequency}
              />
              <TR
                title="Billable"
                value={program.billable}
              />
              <TR
                title="Price"
                value={program.price}
              />
              <TR
                title="Method of delivery"
                value={program.method_of_delivery}
              />
              <TR
                title="Method of registration"
                value={program.method_of_registration}
              />
              <TR
                title="Registration"
                value={program.registration}
              />
              <TR
                title="Contact Person Email"
                value={program.email}
              />
              <TR
                title="Contact Person Phone"
                value={program.primary_phone_number}
              />
              <TR
                title="Secondary Phone"
                value={program.alt_phone_number}
              />
              <tr>
                <td><b>Location</b></td>
                <td>{formatLocation(program.location)}</td>
              </tr>

              {_.keys(_.omit(program.eligibility_conditions, ['lower_age_limit', 'upper_age_limit'])) > 0 &&
                <tr>
                  <td><b>Eligibility Conditions</b></td>
                  <td>
                    {_.map(
                        _.omit(program.eligibility_conditions, ['lower_age_limit', 'upper_age_limit']
                      ), (value, type) => {
                      return (
                        <li key={type}>
                          {formatEligibilityConditions(type, value)}
                        </li>
                      );
                    })}
                    {program.eligibility_conditions.lower_age_limit &&
                      <li>
                        {formatEligibilityConditions('Age greater than' , program.eligibility_conditions.lower_age_limit)}
                      </li>
                    }
                    {program.eligibility_conditions.upper_age_limit &&
                      <li>
                        {formatEligibilityConditions('Age less than' , program.eligibility_conditions.upper_age_limit)}
                      </li>
                    }
                  </td>
                </tr>
              }
              <TR
                title="Public?"
                value={program.is_public ? 'Yes': 'No'}
              />
              <TR
                title="Share with"
                value={(program.share_with || []).join(', ')}
              />
              <TR
                title="Notes"
                value={program.notes}
              />
              <tr>
                <td><b>Provider</b></td>
                <td>
                  <Link to={`/provider/${program.provider.id}`}>
                    {(program.provider.type === 'Organization') ?
                      program.provider.company
                    :
                      `${program.provider.profile.first_name} ${program.provider.profile.last_name}`
                    }
                  </Link>
                </td>
              </tr>
              <tr>
                <td><b>Manager</b></td>
                <td>
                  <Link to={`/user/${program.manager._id}`}>
                    {(program.manager.lastName && program.manager.firstName) ?
                      `${program.manager.lastName}, ${program.manager.firstName}`
                    :
                      program.manager._id
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
    programsById: state.programs.byId,
    programLoaded: state.programs.indexLoaded
  }
}

export default connect(
  mapStateToProps
)(Program);
