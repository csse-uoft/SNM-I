import React, { Component } from 'react';
import { Table } from 'react-bootstrap';


{/*class SearchBar extends Component{
  constructor(props) {
    super(props);
    this.handleInput=this.handleInput.bind(this);
    this.state = {
      searchText: '',
    }
  }
  
  handleInput(event) {
    this.setState({ searchText: event.target.value })
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.state.value}
          onChange={this.handleInput}
        />
      </form>

      <ProvidersIndex>{
            p.providers.map((provider) => {
              return <ProviderRow key={ provider.id } provider={ provider }
                      delete={this.deleteProvider} />
            })
          }</ProvidersIndex>
    );
  }
};


class FilterableProviderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    this.setState({})
  }

  render() {
    return(
      <div>




      )
  }
}*/}

export default class ProvidersIndex extends Component {
  render() {
    return(
      <Table striped condensed hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Email</th>
            <th>Phone</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.props.children }
        </tbody>
      </Table>
    )
  }
}