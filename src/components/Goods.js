import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import GoodsIndex from './goods/GoodsIndex.js'
import GoodRow from './goods/GoodRow.js'
import CSVUploadModal from './shared/CSVUploadModal'
import DeleteModal from './shared/DeleteModal'

// redux
import { connect } from 'react-redux'
import { fetchGoods, createGoods, deleteGood, GOOD_ERROR } from '../store/actions/goodActions.js'


// styles
import { Button, Col, Pagination } from 'react-bootstrap';
import '../stylesheets/Client.scss';

import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";

class MapMarker extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
    }
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.closeInfoBox = this.closeInfoBox.bind(this);
  }

  onMouseEnter() {
    this.setState({
      isOpen: true
    })
  }

  onMouseLeave() {
    this.setState({
      isOpen: false
    })
  }

  closeInfoBox() {
    this.setState({
      isOpen: false
    })
  }

  render() {
    return (
      <Marker
        key={this.props.good.id}
        position={this.props.good.location.lat_lng}
        onMouseOver={() => this.onMouseEnter()}
        onMouseOut={() => this.onMouseLeave()}
      >
      {this.state.isOpen &&
        <InfoWindow onCloseClick={() => this.closeInfoBox()}>
          <GoodInfoBox good={this.props.good}/>
        </InfoWindow>
      }
      </Marker>
    )
  }

}

class GoodInfoBox extends Component {
  render() {
    const good = this.props.good;
    return(
      <div>
        <b>Good name: </b>
          {<Link to={`/good/${good.id}`}>
            {good.name}
          </Link>}
      </div>
    )
  }
}

class Goods extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.changePage = this.changePage.bind(this);
    this.changeNumberPerPage = this.changeNumberPerPage.bind(this);

    this.state = {
      CSVModalshow: false,
      deleteModalshow: false,
      objectId: null,
      numberPerPage: 10,
      currentPage: 1
    };
  }

  handleCSVModalHide() {
    this.setState({ CSVModalshow: false });
  }

  handleCSVModalShow() {
    this.setState({ CSVModalshow: true })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.goods !== prevProps.goods) {
      this.setState({currentPage: 1});
    }
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

  changePage(e) {
    this.setState({currentPage: Number(e.target.text)});
  }

  changeNumberPerPage(e) {
    if (e.target.value === 'all') {
      this.setState({
        numberPerPage: this.props.goods.length,
        currentPage: 1
      });
    }
    else {
      this.setState({
        numberPerPage: e.target.value,
        currentPage: 1
      });
    }
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

    let goodsOnPage = p.goods.slice(
      this.state.numberPerPage * (this.state.currentPage - 1),
      this.state.numberPerPage * this.state.currentPage);
    let pageNumbers = [];
    for (let number = 1; number <= Math.ceil(p.goods.length/this.state.numberPerPage); number++) {
      pageNumbers.push(
        <Pagination.Item
          key={number}
          active={number ===this.state.currentPage}
          onClick={this.changePage}>{number}
        </Pagination.Item>
      )
    }

    const torontoCentroid = { lat: 43.6870, lng: -79.4132 }
    const GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={torontoCentroid} >
        {
          _.map(p.goods, (good) => {
            return <MapMarker good={good}/>
          })
        }
      </GoogleMap>
    ));

    return(
      <div className="clients-table content modal-container">
        <div>
          <h1>Goods</h1>
          <hr/>
          <Link to="/goods/new">
            <Button bsStyle="default">
              Add new good
            </Button>
          </Link>{' '}
          <Button bsStyle="default"  onClick={this.handleCSVModalShow}>
            Add goods by uploading CSV
          </Button>
          <hr/>
          { p.goodsLoaded &&
            <div>
            <GoodsIndex changeNumberPerPage={this.changeNumberPerPage}>{
              goodsOnPage.map((good) => {
                return <GoodRow key={ good.id } good={ good } handleShow={this.handleDeleteModalShow} />
              })
            }</GoodsIndex>
            <Pagination className="pagination">
              {pageNumbers}
            </Pagination>
            </div>
          }
          <hr/>
          { p.goodsLoaded &&
          <div>
          <Col sm={4}>
            <div style={{width: '250%', height: '400px'}}>
              <GMap
                containerElement={
                  <div style={{ height: `100%` }} />
                }
                mapElement={
                  <div style={{ height: `100%` }} />
                }
              />
            </div>
          </Col>
        </div> }
        </div>

        <CSVUploadModal
          show={this.state.CSVModalshow}
          onHide={this.handleCSVModalHide}
          submit={this.handleSubmit}
        />
        <DeleteModal
          contentType="Good"
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
