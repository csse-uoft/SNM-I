import React, { Component } from 'react';

export default class CustomToggle extends Component {
  handleClick = (e) => {
    e.preventDefault();
    this.props.onClick(e);
  }

  render() {
    return (
      <a href="" onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
}