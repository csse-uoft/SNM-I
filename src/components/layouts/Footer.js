import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <h5 style={{
          padding: 4,
          margin: 0,
        }}>
          <a href="http://csse.utoronto.ca/" target="_blank">
            Centre for Social Services Engineering
          </a>, University of Toronto
        </h5>
      </div>
    );
  }
}

export default Footer;
