import React, { Component } from 'react'
import _ from 'lodash'
import StarRatingComponent from 'react-star-rating-component';
import { providerFields } from '../../constants/provider_fields.js'

// components
import { formatOperationHour } from '../../helpers/operation_hour_helpers'
import ProviderInfoTable from './provider_table/ProviderInfoTable';

// styles
import { Table, Button, ListGroup, Well, Badge, Col, Row, Glyphicon } from 'react-bootstrap'

// redux
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { fetchProvider } from '../../store/actions/providerActions.js'
import { fetchProviderFields } from '../../store/actions/settingActions.js';



class ProviderProfile extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchProvider(id));
    if (_.keys(this.props.formSetting).length === 0) {
      this.props.dispatch(fetchProviderFields());
    }
  }

  render() {
    const id = this.props.match.params.id;
    const provider = this.props.providersById[id];

    let formType
    if (provider.type === 'Organization') {
      formType = 'Organization'
    } else if (provider.type === 'Individual') {
      formType = provider.category.split(' ').join('_').toLowerCase()
    }

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
        {this.props.formSetting[formType] &&
          _.map(this.props.formSetting[formType].form_structure, (infoFields, step) => {
          return (
            <ProviderInfoTable
              key={step}
              step={step}
              provider={provider}
              providerFields={providerFields}
              infoFields={infoFields}
            />
          )
        })}
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
    providerLoaded: state.providers.loaded,
    formSetting: state.settings.providers
  }
}

export default connect(
  mapStateToProps
)(ProviderProfile);
