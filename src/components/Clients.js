import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import { Table, Button, Glyphicon } from 'react-bootstrap';

import '../stylesheets/Client.css';

class ClientDashboard extends Component {
  render() {
    return(
      <div className='clients-table content'>
        <div>
          <h1>Clients</h1>
          <Link to={`/clients/new`}>
            <Button bsStyle="default">
              Add new named client profile
            </Button>
          </Link>
          <Link to={`/clients/anonymous/new`}>
            <Button bsStyle="default">
              Add new anonymous client profile
            </Button>
          </Link>
          <hr/>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <Link to={`/client/1`}>
                    Leonardo Dicaprio
                  </Link>
                </td>
                <td>example@gmail.com</td>
                <td>
                  <Link to={`/clients/edit`}>
                    <Button bsStyle="primary">
                      <Glyphicon glyph="edit" />
                    </Button>
                  </Link>
                </td>
                <td>
                  <Button bsStyle="danger">
                    <Glyphicon glyph="trash" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <Link to={`/client/2`}>
                  Robert Downey
                  </Link>
                </td>
                <td>example@gmail.com</td>
                <td>
                  <Button bsStyle="primary">
                    <Glyphicon glyph="edit" />
                  </Button>
                </td>
                <td>
                  <Button bsStyle="danger">
                    <Glyphicon glyph="trash" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export default ClientDashboard;
