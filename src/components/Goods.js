import React, { Component } from 'react';
import _ from 'lodash';

// components
import GoodsIndex from './goods/GoodsIndex.js';
import CrupdateModal from './shared/CrupdateModal.js';
import GoodsForm from './goods/GoodsForm.js';
import GoodsRow from './goods/GoodsRow.js';

// redux
import { connect } from 'react-redux';
import { fetchGoods, createGood, updateGood, deleteGood} from '../store/actions.js';

// styles
import { Button } from 'react-bootstrap';


class Goods extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showCrupdateModal: false,
      activeGood: {}
    } 
  }

  render() {
    const p = this.props, s = this.state;
    return(
      <div className='resources content'>
        <Button bsStyle="primary" onClick={this.showCrupdateModal}>New Goods</Button>
        <h3 className='title'>Goods</h3>
        { p.goodsLoaded &&
          <GoodsIndex>{
            p.goods.map((good) => {
              return <GoodsRow key={ good.id } good={ good }
                        showUpdateModal={this.showCrupdateModal} delete={this.deleteGood} />
            })
          }</GoodsIndex>
        }
        <CrupdateModal  show={s.showCrupdateModal} hide={this.hideCrupdateModal} 
          title={this.modalTitle()}>
          <GoodsForm action={this.formAction()} good={s.activeGood} />
        </CrupdateModal>
      </div>
    )
  }

  componentWillMount() {
    this.props.dispatch(fetchGoods());
  }

  createGood = (params) => {
    this.props.dispatch(createGood(params));
  }

  updateGood = (params) => {
    const id = params.id;
    delete params.id;
    this.props.dispatch(updateGood(id, params));
  }

  deleteGood = (id) => {
    this.props.dispatch(deleteGood(id));
  }

  showCrupdateModal = (good={}) => {
    this.setState({ showCrupdateModal: true, activeGood: good })
  }

  hideCrupdateModal = () => {
    this.setState({ showCrupdateModal: false })
  }

  activeGoodIsNew = () => {
    return(_.isUndefined(this.state.activeGood.id));
  }

  formAction = () => {
    return(this.activeGoodIsNew() ? this.createGood : this.updateGood);
  }

  modalTitle = () => {
    let title = this.activeGoodIsNew() ? "New" : "Update"
    return(title + " Good");
  }
}

const mapStateToProps = (state) => {
  return {
    goods: state.goods.index,
    goodsLoaded: state.goods.loaded,
  }
}

export default connect(
  mapStateToProps
)(Goods);