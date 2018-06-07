import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import GoodsIndex from './goods/GoodsIndex.js'
import GoodRow from './goods/GoodRow.js'

// redux
import { connect } from 'react-redux'
import { fetchGoods, searchGoods } from '../store/actions/goodActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Goods extends Component {
  componentWillMount() {
    this.props.dispatch(fetchGoods());
  }

  render() {
    const p = this.props;
    return(
      <div className='clients-table content'>
        <div>
          <h1>Goods</h1>
          <Link to='/goods/new'>
            <Button bsStyle="default">
              Add new good
            </Button>
          </Link>
          <hr/>
          { p.goodsLoaded &&
            <GoodsIndex>{
              _.map(p.goods, (good) => {
                return <GoodRow key={ good.id } good={ good } />
              })
            }</GoodsIndex>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    goods: state.goods.filteredGoods || [],
    goodsLoaded: state.goods.goodsLoaded
  }
}

export default connect(
  mapStateToProps
)(Goods);
