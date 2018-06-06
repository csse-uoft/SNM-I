import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './ProvidersIndex.js'
import ProviderRow from './ProviderRow.js'

// styles
import { Table, Button, Row, Glyphicon, Form, FormGroup, Col, ControlLabel, FormControl} from 'react-bootstrap'
import { connect } from 'react-redux'
import { updateProvider, fetchProvider } from '../../store/actions/providerActions.js'
import { Link } from 'react-router-dom';

class EditProvider extends Component {
  constructor(props) {
    super(props);

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
    const id = this.props.match.params.id;
    console.log(id);
    const provider = this.props.providersById[id];
    console.log(provider);
    console.log(this.props.providersById)

    this.state= {
      form : {
        provider_type: provider.provider_type,
        id: id,
        first_name: provider.first_name,
        last_name: provider.last_name,
        gender: '',
        email: provider.email,
        phone: provider.phone,
        phone_extension: provider.phone_extension,
        referrer: provider.referrer,
        location: 'Canada',
        visibility: 'select',
        status: provider.status
      }
    }
  }

  componentWillMount() { 
    const id = this.props.match.params.id
    this.props.dispatch(fetchProvider(id));
  }

  formValChange(e) {
    let next = {...this.state.form, [e.target.id] : e.target.value};
    this.setState({ form : next });
  }

  submit(e) {
    e.preventDefault();
    const id = this.props.match.params.id
    this.props.dispatch(updateProvider(this.state.form.id, this.state.form));
    this.props.history.push('/provider/' + id);
  }

  render() {
    const id = this.props.match.params.id;
    const provider = this.props.providersById[id];
    const isEnabled = 
      this.state.form.phone.length > 0 &&
      this.state.form.email.length > 0 &&
      this.state.form.first_name.length > 0 &&
      this.state.form.last_name.length > 0 && 
      this.state.form.location.length > 0 &&
      this.state.form.visibility !== 'select';

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>Edit Provider Profile</h3>
          <hr/>
        </Col>

        { provider && provider.loaded &&
        <div>
          <Form horizontal>
            {provider.provider_type === "Organization" &&
              <FormGroup controlId="company">
                <Col componentClass={ControlLabel} sm={3}>
                  Company (required)
                </Col>
                <Col sm={9}>
                  <FormControl type="text"
                    placeholder="Company name" defaultValue={provider.company} onChange={this.formValChange}/>
                </Col>
              </FormGroup>
            }

            <FormGroup controlId="status">
              <Col componentClass={ControlLabel} sm={3}>
                Status
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.status}
                  onChange={this.formValChange}
                >
                  <option value="select">--- Not Set ---</option>
                  <option value="External">External</option>
                  <option value="Internal">Internal</option>
                  <option value="Home Agency">Home Agency</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="first_name">
              <Col componentClass={ControlLabel} sm={3}>
                First name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text"
                  placeholder="Aravind" defaultValue={provider.first_name} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.last_name}
                  placeholder="Adiga" onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            {provider.provider_type === "Individual" &&
            <FormGroup controlId="preferred_name">
              <Col componentClass={ControlLabel} sm={3}>
                Preferred Name
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue= {provider.preferred_name} onChange={this.formValChange}/>
              </Col>
            </FormGroup>
            }

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue=""
                  placeholder="aravind.adiga.gmail.com" defaultValue={provider.email} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="phone">
              <Col componentClass={ControlLabel} sm={3}>
                Phone Number (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.phone} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="phone_extension">
              <Col componentClass={ControlLabel} sm={3}>
                Extension
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.phone_extension} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId= "location">
              <Col componentClass={ControlLabel} sm={3}>
                Address
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={this.state.location} onChange={this.formValChange}/>
              </Col>
            </FormGroup>
          
            {provider.provider_type === "Individual" &&
            <FormGroup controlId="referrer">
              <Col componentClass={ControlLabel} sm={3}>
                Referrer
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.referrer} onChange={this.formValChange}/>
              </Col>
            </FormGroup>
            }

            <FormGroup controlId="visibility">
              <Col componentClass={ControlLabel} sm={3}>
                Allow other agencies to see this provider?
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select" onChange={this.formValChange}>
                  <option value="select">-- Not Set --</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button disabled = {!isEnabled} type="submit" onClick={this.submit}>
                  Submit
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
        }
      </Row>
    );
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
)(EditProvider);