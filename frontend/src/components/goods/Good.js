import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux'
import { fetchGood } from '../../store/actions/goodActions.js'

import { formatLocation } from '../../helpers/location_helpers'

import { Table, Glyphicon, Button } from 'react-bootstrap';

class Good extends Component {
  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchGood(id));
  }

  render() {
    const p = this.props,
          id = p.match.params.id,
          good = p.goodsById[id];

    return (
      <div className="content client">
        <h3>Good Profile</h3>
        <Link to={`/goods/${good.id}/edit`}>
          <Button bsStyle="primary">
            Edit
          </Button>
        </Link>{' '}
        <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
          <Glyphicon glyph="print" />
        </Button>

        { good && good.goodsLoaded &&
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td><b>Name</b></td>
                <td>{good.name}</td>
              </tr>
              <tr>
                <td><b>Description</b></td>
                <td>{good.desc}</td>
              </tr>
              <tr>
                <td><b>Category</b></td>
                <td>{good.category}</td>
              </tr>
              <tr>
                <td><b>Available from</b></td>
                <td>{good.available_from}</td>
              </tr>
              <tr>
                <td><b>Available until</b></td>
                <td>{good.available_to}</td>
              </tr>
              <tr>
                <td><b>Transportation</b></td>
                <td>{good.transportation}</td>
              </tr>
              <tr>
                <td><b>Condition</b></td>
                <td>{good.condition}</td>
              </tr>
              <tr>
                <td><b>Material</b></td>
                <td>{good.material}</td>
              </tr>
              <tr>
                <td><b>Quantity</b></td>
                <td>{good.quantity}</td>
              </tr>
              <tr>
                <td><b>Length</b></td>
                <td>{good.length}</td>
              </tr>
              <tr>
                <td><b>Width</b></td>
                <td>{good.width}</td>
              </tr>
              <tr>
                <td><b>Height</b></td>
                <td>{good.height}</td>
              </tr>
              <tr>
                <td><b>Diameter</b></td>
                <td>{good.diameter}</td>
              </tr>
              <tr>
                <td><b>Contact Person Email</b></td>
                <td>{good.email}</td>
              </tr>
              <tr>
                <td><b>Contact Person Phone</b></td>
                <td>{good.primary_phone_number}</td>
              </tr>
              <tr>
                <td><b>Secondary Phone</b></td>
                <td>{good.alt_phone_number}</td>
              </tr>
              <tr>
                <td><b>Location</b></td>
                <td>{formatLocation(good.location)}</td>
              </tr>
              <tr>
                <td><b>Share with</b></td>
                <td>{(good.share_with || []).join(', ')}</td>
              </tr>
              <tr>
                <td><b>Notes</b></td>
                <td>{good.notes}</td>
              </tr>
              <tr>
                <td><b>Provider</b></td>
                <td>
                  <Link to={`/provider/${good.provider.id}`}>
                    {`${good.provider.profile.first_name} ${good.provider.profile.last_name}`}
                  </Link>
                </td>
              </tr>
            </tbody>
          </Table>
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    goodsById: state.goods.byId,
    goodLoaded: state.goods.indexLoaded 
  }  
}

export default connect(
  mapStateToProps
)(Good);
