import React, { Component } from 'react'

class Landing extends Component {
  render() {
    return (
      <div style={
        {
          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/landing.jpg) no-repeat center center',
          backgroundSize: 'cover'
        }
      }>
        <div style={{height: 700}}>
        </div>
      </div>
    )
  }
}

export default Landing;
