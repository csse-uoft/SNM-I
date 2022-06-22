import React, { Component } from 'react';

import { Button, FormGroup, FormControl, FormLabel, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { rateProvider } from '../../api/mockedApi/providers';
import StarRatingComponent from 'react-star-rating-component';

class ProviderRatingForm extends Component {
  constructor(props) {
		super(props);
    this.handleStarSelection=this.handleStarSelection.bind(this);
		this.handleCommentChange=this.handleCommentChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handleTextRating=this.handleTextRating.bind(this);
    const id = this.props.match.params.id
    this.state = {
      id: id,
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
    rateProvider(id, this.state);
    this.props.history.push('/provider/' + id);
  }

  render() {
    return (
      <div className="content">
        <Col sm={9}>
          <h3> Rate Provider </h3>
          <hr/>
        </Col>

        <FormGroup controlId="rating">
          <Col componentClass={FormLabel} sm={5}>
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
            <FormLabel>Comments</FormLabel>
            <FormControl
              componentClass="textarea"
              placeholder="Comments about this provider..."
              onChange={this.handleCommentChange}
            />
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
