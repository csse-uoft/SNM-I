import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import { fetchProvider, fetchProviders, createProvider, updateProvider, deleteProvider } from '../../store/actions/providerActions.js'
import StarRatingComponent from 'react-star-rating-component';

class ProviderRatingForm extends Component {
  constructor(props) {
		super(props);
    this.handleStarSelection=this.handleStarSelection.bind(this);
		this.handleCommentChange=this.handleCommentChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handleTextRating=this.handleTextRating.bind(this);
    this.state = {
			rating: 0,
      comment: ''
		}
  }

  handleStarSelection(nextValue, name) {
    this.setState({rating: nextValue});
  }

  handleTextRating(e) {
    this.setState({rating: e.target.value});
  }
  handleCommentChange(e) {
    this.setState({comment: e.target.value});
  }
  handleSubmit(e) {
    const id = this.props.match.params.id
    const provider = this.props.providersById[id];
    
    const currentRate = provider.rating;
    const numRates = provider.num_ratings;
  }

  render() {
    return (
      <div className="content">
        <Col sm={9}>
          <h3> Rate Provider </h3>
          <hr/>
        </Col>

        <FormGroup controlId="rating">
          <Col componentClass={ControlLabel} sm={5}>
            Rate this provider (0-5)
          </Col>
          <Col sm={9}>
            <FormControl 
              type="text"
              placeholder="A number between 0 and 5" 
              value={this.state.rating}
              onChange={this.handleTextRating}
            />
          </Col>
        </FormGroup>
        <Col sm={9}>
          <StarRatingComponent
            name="rating"
            starCount={5}
            value={this.state.rating}
            onStarClick={this.handleStarSelection}
          />
        </Col>        
        <Col sm={9}>
          <hr/>
          <FormGroup controlId="comments">
            <ControlLabel>Comments</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Comments about this provider..." />
          </FormGroup>
        </Col>
        <Col sm={9}>
          <Button type="submit" onClick={this.handleSubmit}> Submit </Button>
        </Col>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return { 
    providersById: state.providers.byId || {},
    providerLoaded: state.providers.indexLoaded
  } 
}

export default connect(
  mapStateToProps  
)(ProviderRatingForm);