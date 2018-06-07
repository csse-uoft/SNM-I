import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import _ from 'lodash';

// redux
import { connect } from 'react-redux'
import { createGood, updateGood } from '../../store/actions/goodActions.js'
import { fetchProviders } from '../../store/actions/providerActions.js'


import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

class GoodForm extends Component {
  constructor(props) {
    super(props);
    let good = {};
    if (this.props.match.params.id) {
      good = this.props.goodsById[this.props.match.params.id]
    }

    this.state = {
      goodId: good.id,
      mode: (good.id) ? 'edit' : 'new',
      form: {
        name: good.name || '',
        desc: good.desc || '',
        category: good.category || '',
        condition: good.condition || '',
        material: good.material || '',
        quantity: good.quantity || '',
        length: good.length || '',
        width: good.width || '',
        height: good.height || '',
        diameter: good.diameter || '',
        email: good.email || '',
        primary_phone_number: good.primary_phone_number || '',
        alt_phone_number: good.alt_phone_number || '',
        location: Object.assign({
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
        }, good.location),
        provider_id: (good.provider && good.provider.id) || ''
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('services'));
    this.props.dispatch(fetchProviders());
  }

  formValChange(e) {
    let nextForm = {...this.state.form, [e.target.id]: e.target.value};
    this.setState({ form: nextForm });
  }

  locationChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['location'][e.target.id] = e.target.value
    this.setState({ form: nextForm });
  }

  submit() {
    if (this.state.mode === 'edit') {
      let form = Object.assign({}, this.state.form);
      this.props.dispatch(updateGood(this.state.goodId, form));
    } else {
      this.props.dispatch(createGood(this.state.form));
    }
    this.props.history.push('/goods')
  }

  render() {
    const p = this.props;

    const formTitle = (this.state.mode === 'edit') ?
      'Edit Good Profile' : 'New Good'

    function categoriesIntoOptions(categories) {
      return categories.map((category) => {
        return <option key={category} value={ category }>{category}</option>
      })
    }


    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{formTitle}</h3>
          <hr />
        </Col>
        <Col sm={12}>
          <Form horizontal>
            <FormGroup controlId="name">
              <Col componentClass={ControlLabel} sm={3}>
                Name
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder=""
                  value={this.state.form.name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="desc">
              <Col componentClass={ControlLabel} sm={3}>
                Description
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.desc} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="category">
              <Col componentClass={ControlLabel} sm={3}>
                Category
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.category}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="food">Food</option>
                  <option value="clothing">Clothing</option>
                  <option value="utensils">Utensils</option>
                  <option value="utensils">Books</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="condition">
              <Col componentClass={ControlLabel} sm={3}>
                Condition
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.condition} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="material">
              <Col componentClass={ControlLabel} sm={3}>
                Material
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.material} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="quantity">
              <Col componentClass={ControlLabel} sm={3}>
                Quantity
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.quantity}
                  placeholder=""
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="length">
              <Col componentClass={ControlLabel} sm={3}>
                Length
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.length}
                  placeholder=""
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="width">
              <Col componentClass={ControlLabel} sm={3}>
                Width
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.width}
                  placeholder=""
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="height">
              <Col componentClass={ControlLabel} sm={3}>
                Height
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.height}
                  placeholder=""
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="diameter">
              <Col componentClass={ControlLabel} sm={3}>
                Diameter
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.diameter}
                  placeholder=""
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Contact Person Email
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.email}
                  placeholder=""
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="primary_phone_number">
              <Col componentClass={ControlLabel} sm={3}>
                Telephone
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  value={this.state.form.primary_phone_number}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="alt_phone_number">
              <Col componentClass={ControlLabel} sm={3}>
                Alternative Phone Number
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  value={this.state.form.alt_phone_number}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="street_address">
              <Col componentClass={ControlLabel} sm={3}>
                Street Address
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.location.street_address}
                  onChange={this.locationChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="apt_number">
              <Col componentClass={ControlLabel} sm={3}>
                Apt. #
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.location.apt_number}
                  onChange={this.locationChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="city">
              <Col componentClass={ControlLabel} sm={3}>
                City
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.location.city}
                  onChange={this.locationChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="province">
              <Col componentClass={ControlLabel} sm={3}>
                Province
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.location.province}
                  onChange={this.locationChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="postal_code">
              <Col componentClass={ControlLabel} sm={3}>
                Postal Code
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.location.postal_code}
                  onChange={this.locationChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="provider_id">
              <Col componentClass={ControlLabel} sm={3}>
                Provider
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.provider_id}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  {p.providers.map(provider =>
                    <option key={provider.id} value={provider.id}>
                      {provider.first_name + " " + provider.last_name}
                    </option>
                  )}
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button onClick={this.submit}>
                  Submit
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    goodsById: state.goods.byId,
    goodsCategories: state.ontology.services.categories,
    categoriesLoaded: state.ontology.services.loaded,
    providers: state.providers.filteredProviders || [],
    providersLoaded: state.providers.loaded
  }
}

export default connect(mapStateToProps)(withRouter(GoodForm));
