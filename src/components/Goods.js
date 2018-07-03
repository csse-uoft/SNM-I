import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import GoodsIndex from './goods/GoodsIndex.js'
import GoodRow from './goods/GoodRow.js'
import CSVUploadModal from './shared/CSVUploadModal'
import DeleteModal from './shared/DeleteModal'

// redux
import { connect } from 'react-redux'
import { fetchGoods, searchGoods, createGoods, deleteGood, GOOD_ERROR } from '../store/actions/goodActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Goods extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      CSVModalshow: false,
      deleteModalshow: false,
      objectId: null
    };
  }

  handleCSVModalHide() {
    this.setState({ CSVModalshow: false });
  }

  handleCSVModalShow() {
    this.setState({ CSVModalshow: true })
  }

  handleSubmit(e) {
    const file = document.querySelector('input[type="file"]').files[0];
    this.props.dispatch(createGoods(file)).then((status) => {
      if (status === GOOD_ERROR) {
        // this.setState({ displayError: true });
      } else {
        this.setState({ CSVModalshow: false })
      }
    });
  }

  handleDeleteModalHide() {
    this.setState({ deleteModalshow: false });
  }

  handleDeleteModalShow(id) {
    this.setState({
      deleteModalShow: true,
      objectId: id
    })
  }

  handleDelete(id, form) {
    this.props.dispatch(deleteGood(id, form)).then((status) => {
      if (status === GOOD_ERROR) {
        // this.setState({ displayError: true });
      } else {
        this.setState({ deleteModalShow: false })
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
          <Button bsStyle="default"  onClick={this.handleCSVModalShow}>
            Add goods by uploading CSV
          </Button>
          <hr/>
          { p.goodsLoaded &&
            <GoodsIndex>{
              _.map(p.goods, (good) => {
                return <GoodRow key={ good.id } good={ good } handleShow={this.handleDeleteModalShow} />
              })
            }</GoodsIndex>
          }
        </div>
        <CSVUploadModal
          show={this.state.CSVModalshow}
          onHide={this.handleCSVModalHide}
          submit={this.handleSubmit}
        />
        <DeleteModal
          contentType='Good'
          objectId={this.state.objectId}
          show={this.state.deleteModalShow}
          onHide={this.handleDeleteModalHide}
          delete={this.handleDelete}
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
