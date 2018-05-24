import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import { Table, Button, Glyphicon } from 'react-bootstrap';

//import '../stylesheets/Client.css';

export default class AddServicePrompt extends Component {
  render() {
  	return(
  		<div className='clients-table content'>
        <div>
          <h1>Would you like to add a service for this provider?</h1>
          <Link to={`/service/new`}>
            <Button bsStyle="default">
              Yes
            </Button>
          </Link>
          <Link to={`/providers`}>
            <Button bsStyle="default">
              No
            </Button>
          </Link>
         </div>
        </div>

  	)
  }
}