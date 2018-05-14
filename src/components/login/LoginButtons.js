import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Button } from 'react-bootstrap';

class LoginButtons extends Component {
  render() {
    return(
      <div className="login-buttons">
        <Link to={`/login-pane`}>
          <Button bsStyle="default" className="btn-default-login" block>
            Sign in with SNM account
          </Button>
        </Link>
        <Button bsStyle="default" className="btn-facebook" block>
          Facebook
        </Button>
        <Button bsStyle="default" className="btn-google" block>
          Google
        </Button>
      </div>
    )
  }
}

export default LoginButtons;
