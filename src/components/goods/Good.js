import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux'
import { fetchGood } from '../../store/actions/goodActions.js'

import { formatLocation } from '../../helpers/location_helpers'

import { Table } from 'react-bootstrap';

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
      <div className="content">
        <h3>Good Profile</h3>
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
                <td><b>Share with</b></td>
                <td>{good.share_with}</td>
              </tr>
              <tr>
                <td><b>Provider</b></td>
                <td>
                  <Link to={`/provider/${good.provider.id}`}>
                    {`${good.provider.first_name} ${good.provider.last_name}`}
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
