import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import _ from 'lodash'

// components
import { formatLocation } from '../../helpers/location_helpers'
import { formatOperationHours } from '../../helpers/operation_hour_helpers'

// styles
import { Table, Button, ListGroup, Well, Badge, Col, Row } from 'react-bootstrap'
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
    if (provider && provider.loaded){
      console.log(provider.reviews)
    }
    return (
      <div className="content">
        <h3>Provider Profile</h3>

      { provider && provider.loaded &&
        <div>
         <Link to={`/provider/${id}/edit/${provider.provider_type.toLowerCase()}`}>
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

        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <td><b>Type</b></td>
              <td>{provider.provider_type}</td>
            </tr>

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
            <td><b>First Name</b></td>
            <td>{provider.first_name}</td>
          </tr>
          <tr>
            <td><b>Last Name</b></td>
            <td>{provider.last_name}</td>
          </tr>

          {provider.provider_type === "Individual" && provider.preferred_name && 
            <tr>
              <td><b>Preferred Name</b></td>
              <td>{provider.preferred_name}</td>
            </tr>
          }
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

          {provider.primary_phone_extension !== '' &&
          <tr>
            <td><b>Extension</b></td>
            <td>{provider.primary_phone_extension}</td>
          </tr>
          }

          {provider.alt_phone_number !== '' &&
          <tr>
            <td><b>Alternate Phone Number</b></td>
            <td>{provider.alt_phone_number} </td>
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
            <td>{formatLocation(provider.address)}</td>
          </tr>

          {provider.provider_type === "Organization" &&
            <tr>
              <td><b>Operation Hours</b></td>
              <td>{
                provider.operation_hours ? formatOperationHours(provider.operation_hours).split("\n").map(day => <p key={day}> {day} </p>) : "None provided"} </td>
            </tr>
          }

          {provider.provider_type === "Individual" && provider.referrer &&
          <tr>
            <td><b>Referrer</b></td>
            <td>{provider.referrer}</td>
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
