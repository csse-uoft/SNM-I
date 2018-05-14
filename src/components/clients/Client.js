import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Table, Button, Glyphicon } from 'react-bootstrap';

export default class Client extends Component {
  render() {
    return (
      <div className="content">
        <h3>Client Profile</h3>
        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <td><b>First Name</b></td>
              <td>Leonardo</td>
            </tr>
            <tr>
              <td><b>Last Name</b></td>
              <td>Dicaprio</td>
            </tr>
            <tr>
              <td><b>Gender</b></td>
              <td>Male</td>
            </tr>
            <tr>
              <td><b>Preferred Name</b></td>
              <td>Leo</td>
            </tr>
            <tr>
              <td><b>Date of Birth</b></td>
              <td>2012-01-02</td>
            </tr>
            <tr>
              <td><b>Marital Status</b></td>
              <td>Single</td>
            </tr>
            <tr>
              <td><b>Email</b></td>
              <td>leo@gmail.com</td>
            </tr>
            <tr>
              <td><b>Cell Phone</b></td>
              <td>123-456-789</td>
            </tr>
            <tr>
              <td><b>Home Phone</b></td>
              <td>123-456-789</td>
            </tr>
            <tr>
              <td><b>Address</b></td>
              <td>27 King's College Circle Toronto, Ontario M5S 1A1 Canada</td>
            </tr>
            <tr>
              <td><b>Family Code</b></td>
              <td></td>
            </tr>
            <tr>
              <td><b>Landing Date</b></td>
              <td>2018-01-01</td>
            </tr>
            <tr>
              <td><b>Arrival Date</b></td>
              <td>2018-01-01</td>
            </tr>
            <tr>
              <td><b>Re-entry Date</b></td>
              <td>2018-01-03</td>
            </tr>
            <tr>
              <td><b>Initial Destination</b></td>
              <td>Toronto</td>
            </tr>
            <tr>
              <td><b>Country of Origin</b></td>
              <td>US</td>
            </tr>
            <tr>
              <td><b>Last Residence</b></td>
              <td>New York</td>
            </tr>
            <tr>
              <td><b>Immi. Class</b></td>
              <td></td>
            </tr>
            <tr>
              <td><b>Immi. Status</b></td>
              <td></td>
            </tr>
            <tr>
              <td><b>Immi. Card Type</b></td>
              <td></td>
            </tr>
            <tr>
              <td><b>Aboriginal Status</b></td>
              <td></td>
            </tr>
            <tr>
              <td><b>Preferred Official Language</b></td>
              <td>English</td>
            </tr>
          </tbody>
        </Table>
        <hr/>
        <h3>Needs</h3>
        <Link to={`/needs/new`}>
          <Button bsStyle="default">
            Add need
          </Button>
        </Link>
        <hr/>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <Link to={`/client/1`}>
                  Food
                </Link>
              </td>
              <td>Baby food</td>
              <td>Unfulfilled</td>
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
                  Language
                </Link>
              </td>
              <td>Klingon</td>
              <td>Unfulfilled</td>
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
    )
  }
}
