import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import _ from 'lodash';
import { provinceOptions } from '../../store/defaults';

// redux
import { connect } from 'react-redux'
import SelectField from '../shared/fields/SelectField'
import GeneralField from '../shared/fields/GeneralField'
import { createGood, updateGood, GOOD_SUCCESS } from '../../store/actions/goodActions.js'
import { fetchProviders } from '../../store/actions/providerActions.js'
import RadioField from '../shared/fields/RadioField'
import { formatLocation } from '../../helpers/location_helpers.js';


import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Radio } from 'react-bootstrap';

class GoodForm extends Component {
  constructor(props) {
    super(props);
    let good = {};
    if (this.props.match.params.id) {
      good = this.props.goodsById[this.props.match.params.id];
    }

    this.state = {
      goodId: good.id,
      mode: (good.id) ? 'edit' : 'new',
      is_provider_location: false,
      form: {
        name: good.name || '',
        desc: good.desc || '',
        category: good.category || '',
        available_from: good.available_from || '',
        available_to: good.available_to || '',
        transportation: good.transportation || '',
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
        share_with: good.share_with || '',
        notes: good.notes || '',
        provider_id: (good.provider && good.provider.id) || ''
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.submit = this.submit.bind(this);
    this.indicatorChange = this.indicatorChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('goods'));
    this.props.dispatch(fetchProviders());
  }

  formValChange(e, id=e.target.id) {
    let nextForm;
    if (id === 'location') {
      nextForm = {...this.state.form, [id]: JSON.parse(e.target.value)};
    }
    else {
      nextForm = {...this.state.form, [id]: e.target.value};
    }
    this.setState({ form: nextForm });
  }

  locationChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['location'][e.target.id] = e.target.value
    this.setState({ form: nextForm });
  }

  indicatorChange(e, id) {
    this.setState({ [id] : JSON.parse(e.target.value) });
  }

  submit() {
    let form = Object.assign({}, this.state.form);
    if (this.state.mode === 'edit') {
      this.props.dispatch(
        updateGood(this.state.goodId, form, (status, err, goodId) => {
        if (status === GOOD_SUCCESS) {
          this.props.history.push('/goods/')
        } else {
          const error_messages =
            _.reduce(JSON.parse(err.message), (result, error_messages, field) => {
              const titleizedField = (field.charAt(0).toUpperCase() + field.slice(1))
                .split('_').join(' ')
              _.each(error_messages, message => {
                result.push(message.replace('This field', titleizedField))
              })
              return result;
            }, [])
          this.setState({ showAlert: true, error_messages: error_messages });
        }
      }));
    } else {
      this.props.dispatch(
        createGood(this.state.form, (status, err, goodId) => {
        if (status === GOOD_SUCCESS) {
          this.props.history.push('/goods/')
        } else {
          const error_messages =
            _.reduce(JSON.parse(err.message), (result, error_messages, field) => {
              const titleizedField = (field.charAt(0).toUpperCase() + field.slice(1))
                .split('_').join(' ')
              _.each(error_messages, message => {
                result.push(message.replace('This field', titleizedField))
              })
              return result;
            }, [])
          this.setState({ showAlert: true, error_messages: error_messages });
        }
      }));
    }
  }

  render() {
    const p = this.props;

    const formTitle = (this.state.mode === 'edit') ?
      'Edit Good Profile' : 'New Good'

    let provider;
    if (this.state.form.provider_id) {
      provider = this.props.providersById && this.props.providersById[this.state.form.provider_id];
    }

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{formTitle}</h3>
          <hr />
        </Col>
        <Col sm={12}>
            <Form horizontal>
            {this.state.showAlert &&
              <Col sm={12} className="flash-error">
                {_.map(this.state.error_messages, (message, index) => {
                  return (
                    <li key={index}>
                      {message}
                    </li>
                  );
                })}
              </Col>
            }
            <SelectField
              id="provider_id"
              label="Provider"
              options={_.reduce(p.providers, (map, provider) => {
                if (provider.type === 'Individual') {
                  map[provider.id] = provider.profile.first_name + " " + provider.profile.last_name;
                } else {
                  map[provider.id] = provider.company
                }
                return map;
              }, {})}
              componentClass="select"
              value={this.state.form.provider_id}
              onChange={this.formValChange}
              required
            />

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Link to="/providers/new">
                  <Button>
                    Add new provider
                  </Button>
                </Link>
              </Col>
            </FormGroup>

            <GeneralField
              id="name"
              label="Name"
              type="text"
              value={this.state.form.name}
              onChange={this.formValChange}
              required
            />

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
                Category *
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.category}
                  onChange={this.formValChange}
                  required
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Food">Food</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Utensils">Utensils</option>
                  <option value="Books">Books</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="transportation">
              <Col componentClass={ControlLabel} sm={3}>
                Transportation
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.transportation} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="available_from">
              <Col componentClass={ControlLabel} sm={3}>
                Available from
              </Col>
              <Col sm={9}>
                <FormControl
                  type="date"
                  value={this.state.form.available_from}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="available_to">
              <Col componentClass={ControlLabel} sm={3}>
                Available until
              </Col>
              <Col sm={9}>
                <FormControl
                  type="date"
                  value={this.state.form.available_to}
                  onChange={this.formValChange}
                />
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

            <GeneralField
              id="email"
              label="Contact Person Email"
              type="email"
              value={this.state.form.email}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="primary_phone_number"
              label="Telephone"
              type="tel"
              value={this.state.form.primary_phone_number}
              onChange={this.formValChange}
              required
            />
            <GeneralField
              id="alt_phone_number"
              label="Alternative Phone Number"
              type="tel"
              value={this.state.form.alt_phone_number}
              onChange={this.formValChange}
              required
            />
            <RadioField
              id="is_provider_location"
              label="Location"
              options={{ 'Same as provider': true, 'Other': false }}
              onChange={this.indicatorChange}
              defaultChecked={this.state.is_provider_location}
              required
            />
            {this.state.is_provider_location && this.state.form.provider_id &&
              <div>
                <FormGroup controlId="location">
                  <Col className="required" componentClass={ControlLabel} sm={3}>
                    Select the location this good is provided at
                  </Col>
                  <Col sm={9}>
                    <Radio
                      name="provider_address"
                      value={JSON.stringify(provider.main_address)}
                      onChange={(e) => this.formValChange(e, 'location')}
                    >
                      {formatLocation(provider.main_address)}
                    </Radio>{' '}
                    { provider.other_addresses.map((address, index) =>
                    <Radio
                      name="provider_address"
                      value={JSON.stringify(address)}
                      onChange={(e) => this.formValChange(e, 'location')}
                      key={index}
                      >
                      {formatLocation(address)}
                    </Radio>
                    )}
                  </Col>
                </FormGroup>
              </div>
            }
            {!this.state.is_provider_location &&
            <div>
              <GeneralField
                id="street_address"
                label="Street Address"
                type="text"
                value={this.state.form.location.street_address}
                onChange={this.locationChange}
              />
              <GeneralField
                id="apt_number"
                label="Apt. #"
                type="text"
                value={this.state.form.location.apt_number}
                onChange={this.locationChange}
              />
              <GeneralField
                id="city"
                label="City"
                type="text"
                value={this.state.form.location.city}
                onChange={this.locationChange}
              />
              <SelectField
                id="province"
                label="Province"
                options={provinceOptions}
                componentClass="select"
                value={this.state.form.location.province}
                onChange={this.locationChange}
              />
              <GeneralField
                id="postal_code"
                label="Postal Code"
                type="text"
                value={this.state.form.location.postal_code}
                onChange={this.locationChange}
              />
            </div>
            }

            <FormGroup controlId="share_with">
              <Col componentClass={ControlLabel} sm={3}>
                Share with
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.share_with}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Boost Child & Youth Advocacy Centre">Boost Child & Youth Advocacy Centre</option>
                  <option value="Children's Aid Society of Toronto">Children's Aid Society of Toronto</option>
                  <option value="Abrigo Centre">Abrigo Centre</option>
                  <option value="Barbra Schlifer Commemorative Clinic">Barbra Schlifer Commemorative Clinic</option>
                  <option value="Durham Rape Crisis Centre">Durham Rape Crisis Centre</option>
                  <option value="Durham Children's Aid Society">Durham Children's Aid Society</option>
                  <option value="Alexandra Park Community Centre">Alexandra Park Community Centre</option>
                  <option value="Applegrove Community Complex">Applegrove Community Complex</option>
                  <option value="Albion Neighbourhood Goods">Albion Neighbourhood Goods</option>
                  <option value="Applegrove Community Complex">Applegrove Community Complex</option>
                  <option value="Kababayan Multicultural Centre">Kababayan Multicultural Centre</option>
                  <option value="Central Toronto Youth Goods">Central Toronto Youth Goods</option>
                  <option value="Covenant House Toronto">Covenant House Toronto</option>
                  <option value="Durham Youth Housing and Support Goods">Durham Youth Housing and Support Goods</option>
                  <option value="Eva's Initiatives">Eva's Initiatives</option>
                  <option value="Horizons for Youth">Horizons for Youth</option>
                  <option value="AIDS Committee of Durham Region">AIDS Committee of Durham Region</option>
                  <option value="Arab Community Centre of Toronto">Arab Community Centre of Toronto</option>
                  <option value="Pediatric Oncology Group of Ontario">Pediatric Oncology Group of Ontario</option>
                  <option value="Adventist community goods">Adventist community goods</option>
                  <option value="Aurora Food Pantry">Aurora Food Pantry</option>
                  <option value="Bluffs Food Bank">Bluffs Food Bank</option>
                  <option value="Brock Community Food Bank">Brock Community Food Bank</option>
                  <option value="Markham Food Bank">Markham Food Bank</option>
                  <option value="Parkdale Community Food Bank">Parkdale Community Food Bank</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="notes">
              <Col componentClass={ControlLabel} sm={3}>
                Notes
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.notes} onChange={this.formValChange} />
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
    servicesCategories: state.ontology.services.categories,
    categoriesLoaded: state.ontology.services.loaded,
    providers: state.providers.filteredProviders || [],
    providersById: state.providers.byId,
    providersLoaded: state.providers.loaded,
    providerIndex: state.providers.index
  }
}

export default connect(mapStateToProps)(withRouter(GoodForm));
