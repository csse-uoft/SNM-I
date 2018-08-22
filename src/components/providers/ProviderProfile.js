import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import _ from 'lodash'

// components
import { formatLocation } from '../../helpers/location_helpers'
import { formatOperationHours } from '../../helpers/operation_hour_helpers'

// styles
import { Table, Button, ListGroup, Well, Badge, Col, Row, Glyphicon } from 'react-bootstrap'
import { fetchProvider } from '../../store/actions/providerActions.js'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

class ProviderProfile extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchProvider(id));
  }

  render() {
    const id = this.props.match.params.id;
    const provider = this.props.providersById[id];
    return (
      <div className="content">
        <h3>Provider Profile</h3>

      { provider && provider.loaded &&
        <div>
         <Link to={`/provider/${id}/edit/`}>
          <Button bsStyle="default">
            Edit
          </Button>
        </Link>
        &nbsp;
        <Link to={`/provider/${id}/rate`}>
          <Button bsStyle="default">
            Rate Provider
          </Button>
        </Link>
        &nbsp;
        <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
          <Glyphicon glyph="print" />
        </Button>

        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <td><b>Type</b></td>
              <td>{provider.provider_type}</td>
            </tr>

            {provider.provider_category &&
              <tr>
                <td><b>Category</b></td>
                <td>{provider.provider_category}</td>
              </tr>
            }

            <tr>
              <td><b>Status</b></td>
              <td>{provider.status}</td>
            </tr>

          {provider.provider_type === "Organization" &&
            <tr>
              <td><b>Company Name</b></td>
              <td>{provider.company}</td>
            </tr>
          }

          <tr>
            <td><b>{provider.provider_type === "Individual" ? "First Name" : "Contact Person First Name"}</b></td>
            <td>{provider.first_name}</td>
          </tr>
          <tr>
            <td><b>{provider.provider_type === "Individual" ? "Last Name" : "Contact Person Last Name"}</b></td>
            <td>{provider.last_name}</td>
          </tr>

          {provider.provider_type === "Individual" &&
            <tr> 
              <td><b>Gender</b></td>
              <td>{provider.gender}</td>
            </tr>
          }

          <tr>
            <td><b>Email</b></td>
            <td>{provider.email}</td>
          </tr>

          <tr>
            <td><b>Phone</b></td>
            <td>{provider.primary_phone_number}</td>
          </tr>

          {provider.primary_phone_extension &&
          <tr>
            <td><b>Extension</b></td>
            <td>{provider.primary_phone_extension}</td>
          </tr>
          }

          {provider.alt_phone_number &&
          <tr>
            <td><b>Alternate Phone Number</b></td>
            <td>{provider.alt_phone_number} </td>
          </tr>
          }

          {provider.alt_phone_extension &&
          <tr>
            <td><b>Alternate Phone Extension</b></td>
            <td>{provider.alt_phone_extension} </td>
          </tr>
          }

          {provider.provider_type === "Organization" && provider.sec_contact_first_name &&
            <tr>
              <td><b>Secondary Contact First Name</b></td>
              <td>{provider.sec_contact_first_name} </td>
            </tr>
          }
          {provider.provider_type === "Organization" && provider.sec_contact_last_name &&
            <tr>
              <td><b>Secondary Contact Last Name</b></td>
              <td>{provider.sec_contact_last_name} </td>
            </tr>
          }
          {provider.provider_type === "Organization" && provider.sec_contact_email &&   
            <tr>
              <td><b>Secondary Contact Email</b></td>
              <td>{provider.sec_contact_email} </td>
            </tr>
          }

          {provider.provider_type === "Organization" && provider.sec_contact_primary_phone_number &&
            <tr>
              <td><b>Secondary Contact Phone Number</b></td>
              <td>{provider.sec_contact_primary_phone_number} </td>
            </tr>
          }
          {provider.provider_type === "Organization" && provider.primary_phone_extension &&
            <tr>
              <td><b>Secondary Contact Extension</b></td>
              <td>{provider.sec_contact_primary_phone_extension} </td>
             </tr>
          }
          {provider.provider_type === "Organization" && provider.sec_contact_alt_phone_number &&
            <tr>
              <td><b>Secondary Contact Alternate Phone Number</b></td>
              <td>{provider.sec_contact_alt_phone_number} </td>
            </tr>
          }
          {provider.provider_type === "Organization" && provider.sec_contact_alt_phone_extension &&
            <tr>
              <td><b>Secondary Contact Alternate Extension</b></td>
              <td>{provider.sec_contact_alt_phone_extension} </td>
            </tr>
          }

          <tr>
            <td><b>Address</b></td>
            <td>{formatLocation(provider.main_address)}</td>
          </tr>

          {(provider.other_addresses && provider.other_addresses.length > 0) &&
            <tr>
              <td><b>Alternate Address(es)</b></td>
              <td>
                {provider.other_addresses.map(address =>
                  <li key={address.id}>{formatLocation(address)}</li>)}
              </td>
            </tr>
          }

          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Emergency contact</b></td>
              <td>{provider.emergency_contact_name ? provider.emergency_contact_name + ", " + provider.emergency_contact_phone + ", " + provider.emergency_contact_email + ", " + provider.emergency_contact_relationship : ""}</td>
            </tr>
          }

          <tr>
            <td><b>{provider.provider_type === "Organization" ? "Operation Hours" : "Availability"}</b></td>
            <td>{
              provider.operation_hours.length !== 0 ? formatOperationHours(provider.operation_hours).split("\n").map(day => <p key={day}> {day} </p>) : "None provided"} </td>
          </tr>

          {provider.languages &&
          <tr>
            <td><b>Languages</b></td>
            <td>{provider.languages.map(language =>
              <li key={language}>{language}</li>
              )}
            </td>
          </tr>
          }

          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Own Car</b></td>
              <td>{provider.own_car}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Start date</b></td>
              <td>{provider.start_date}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Commitment</b></td>
              <td>{provider.commitment}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Skills</b></td>
              <td>{provider.skills}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Education</b></td>
              <td>{provider.education}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Employment</b></td>
              <td>{provider.employment}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Volunteering experience</b></td>
              <td>{provider.experience}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Interests/hobbies</b></td>
              <td>{provider.interests}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Reason for volunteering</b></td>
              <td>{provider.reason_for_volunteering}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Reference 1</b></td>
              <td>{provider.reference1_name ? provider.reference1_name + ", " + provider.reference1_phone + ", " + provider.reference1_email : ""}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.provider_category === "Volunteer/Goods Donor" &&
            <tr>
              <td><b>Reference 2</b></td>
              <td>{provider.reference2_name ? provider.reference2_name + ", " + provider.reference2_phone + ", " + provider.reference2_email : ""}</td>
            </tr>
          }
          {provider.provider_type === "Individual" && provider.referrer &&
            <tr>
              <td><b>Referrer</b></td>
              <td>{provider.referrer}</td>
            </tr>
          }
          {provider.notes &&
            <tr>
              <td><b>Additional notes</b></td>
              <td>{provider.notes}</td>
            </tr>
          }
         </tbody>
        </Table>
    <hr/>

    <h3> Reviews </h3>
    <p/>
    <Well bsSize="small">
      <Row>
        <Col sm={3}>
          Overall Rating:
        </Col>
        <Col>
          <StarRatingComponent
            name="rating"
            editing={false}
            starCount={5}
            value={((provider.reviews.map(review => review.rating))
                      .reduce((first, second) => first + second, 0)) / provider.reviews.length}
          />
        </Col>
      </Row>
    </Well>
    <hr/>
    <ListGroup componentClass="ul">
      {provider.reviews.map(review =>
        <StarCommentRating
          key={review.created_at}
          rating={review.rating}
          comment={review.comment}
          createdAt={review.created_at}/>)
      }
    </ListGroup>

     <h3>Services</h3>
      <Link to="/services/new">
        <Button bsStyle="default">
          Add Service
        </Button>
      </Link>
    <hr/>
    <ProviderServiceTable provider={provider}/>
    </div>
  }
  </div>  
  );
  }
}

class StarCommentRating extends Component {
  render() {
    return(
      <li className="list-group-item">
        <Row>
          <Col sm={10}>
            <StarRatingComponent
              name="rating"
              editing={false}
              starCount={5}
              value={this.props.rating}
            />
            <p/>
            {this.props.comment}
          </Col>
          <Col>
            <p>
              <Badge>{"Date: " + this.props.createdAt.split("T")[0]}</Badge>
            </p>
          </Col>
        </Row>
      </li>
    )
  }
}

class ProviderServiceTable extends Component {
  render() {
    return(
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Capacity</th>
          </tr>
        </thead>
          <tbody>
            {this.props.provider.services.map((service) => {
              return <ProviderServiceRow key={ service.id } service={service}/>
              })
            }
          </tbody>
      </Table>
    )
  }
}

class ProviderServiceRow extends Component {
  render() {
    return(
      <tr>
        <td>{this.props.service.id}</td>
        <td>
          <Link to={`/service/${this.props.service.id}`}>
            {this.props.service.name}
          </Link>
        </td>
        <td className='centered-text'>
          {this.props.service.category}
        </td>
        <td className='centered-text'>
          {this.props.service.desc}
        </td>
        <td className='centered-text'>
          {this.props.service.capacity}
        </td>
      </tr>
    )
  }
}

const mapStateToProps = (state) => {
  return { 
    providersById: state.providers.byId || {},
    providerLoaded: state.providers.loaded
  } 
}

export default connect(
  mapStateToProps  
)(ProviderProfile);
