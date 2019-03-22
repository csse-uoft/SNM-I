import React, { Component } from 'react'
import { withRouter } from 'react-router';

// redux
import { connect } from 'react-redux';
import { login, LOGIN_SUCCESS, clearAlert } from '../../store/actions/authAction';
import { FormGroup, Form, Col, FormControl, Button, HelpBlock, Glyphicon } from 'react-bootstrap';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        username: '',
        password: ''
      },
      displayError: false
    }

    this.submit = this.submit.bind(this);
    this.formValChange = this.formValChange.bind(this);
    this.componentCleanup = this.componentCleanup.bind(this);
  }

  componentCleanup() {
    this.props.dispatch(clearAlert());
  }

  componentDidMount(){
      window.addEventListener('beforeunload', this.componentCleanup);
    }

  componentWillUnmount() {
    this.componentCleanup();
    window.removeEventListener('beforeunload', this.componentCleanup);
  }

  submit() {
    this.props.dispatch(login(this.state.form)).then((status) => {
      const p = this.props
      if (status === LOGIN_SUCCESS) {
        p.history.push('/dashboard')
      }
    });
  }

  formValChange(e) {
    let nextForm = {...this.state.form, [e.target.id]: e.target.value};
    this.setState({ form: nextForm });
  }

  render() {
    const s = this.state;
    return (
      <Form horizontal>
        { this.props.alert &&
          <div className="flash-error">
            <Glyphicon glyph="exclamation-sign" />
            {this.props.alert}
          </div>
        }
        <FormGroup controlId="username">
          <Col sm={12}>
            <FormControl type="text" placeholder="username" value={this.state.form.username} onChange={this.formValChange} />
          </Col>
        </FormGroup>

        <FormGroup className="password" controlId="password">
          <Col sm={12}>
            <FormControl type="password" placeholder="Password" value={this.state.form.password} onChange={this.formValChange} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={12}>
            <div className="login-buttons">
              <Button
                className="btn-default-login"
                onClick={this.submit}
              >
                Sign in
              </Button>
            </div>
          </Col>
          <HelpBlock className="forgot-password">
            Forgot password?
          </HelpBlock>
        </FormGroup>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    alert: state.auth.alert
  }
}

export default connect(mapStateToProps)(withRouter(LoginForm));
