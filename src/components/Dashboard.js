import React, { Component } from 'react';

import '../stylesheets/Dashboard.css';
import calendarPlaceholder from '../assets/calendar.png'

class Dashboard extends Component {
  render() {
    return(
      <div>
        <div className='dashboard content'>
          <img src={calendarPlaceholder} className='calendar-placeholder' />
        </div>
      </div>
    )
  }
}


export default Dashboard;
