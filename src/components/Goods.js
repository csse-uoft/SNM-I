import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import GoodsIndex from './goods/GoodsIndex.js'
import GoodRow from './goods/GoodRow.js'
import CSVUploadModal from './shared/CSVUploadModal'

// redux
import { connect } from 'react-redux'
import { fetchGoods, searchGoods, createGoods, GOOD_ERROR } from '../store/actions/goodActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Goods extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleHide = this.handleHide.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit .bind(this);

    this.state = {
      show: false
    };
  }

  handleHide() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true })
  }

  handleSubmit(e) {
    const file = document.querySelector('input[type="file"]').files[0];
    this.props.dispatch(createGoods(file)).then((status) => {
      if (status === GOOD_ERROR) {
      } else {
        this.setState({ show: false })
      }
    });
  }

  componentWillMount() {
    this.props.dispatch(fetchGoods());
  }

  render() {
    const p = this.props;
    return(
      <div className='clients-table content modal-container'>
        <div>
          <h1>Goods</h1>
          <Link to='/goods/new'>
            <Button bsStyle="default">
              Add new good
            </Button>
          </Link>
          <Button bsStyle="default"  onClick={this.handleShow}>
            Add goods by uploading CSV
          </Button>
          <hr/>
          { p.goodsLoaded &&
            <GoodsIndex>{
              _.map(p.goods, (good) => {
                return <GoodRow key={ good.id } good={ good } />
              })
            }</GoodsIndex>
          }
        </div>
        <CSVUploadModal
          show={this.state.show}
          onHide={this.handleHide}
          submit={this.handleSubmit}
        />
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
