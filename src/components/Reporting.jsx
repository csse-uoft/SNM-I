import React, { Component } from 'react';
import { Bar as BarChart } from 'react-chartjs';
import {chart} from 'chart.js';
import { Pie as PieChart } from 'react-chartjs';
import { Table, Label, Glyphicon, Button } from 'react-bootstrap';
import {fetchReports} from '../store/actions/reportingaction';
import { connect } from 'react-redux';
import { serverHost } from '../store/defaults.js';


export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_clients: 0,
      no_of_females: 0,
      no_of_males: 0,
      no_of_others: 0
    }
  }

  componentWillMount() {
    const url = serverHost + '/reporting/';
    fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }),
      }).then(response => response.json())
      .then(data => this.setState({total_clients: data.total_clients, no_of_females: data.total_females,
       no_of_males: data.total_males, no_of_others: data.total_others}));
  }
  
  render() {
    const chartData = {
      labels: ["Blue", "Green", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    }
    const chartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }

    var pieData = [
      {
        value: this.state.no_of_females,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Female"
      },
      {
        value: this.state.no_of_males,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Male"
      },
      {
        value: this.state.no_of_others,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Others"
      }
    ] 
    
    const options = {
      maintainAspectRatio: false,
      responsive: false,
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10
        }
      }
    }

    return(
      <div className="content client">
        <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
            <Glyphicon glyph="print" />
          </Button>
          <Table bordered condensed className="client-profile-table">
              <tbody>
                <tr>
                  <td colSpan="2"><b>Statistics:</b></td>
                </tr>
                <tr>
                  <td ><b>Number of clients</b></td>
                  <td><PieChart data={pieData} options={options} />
                  <br></br>
                  Total = {this.state.total_clients}
                  <br></br>
                  Female = {this.state.no_of_females}
                  <br></br>
                  Male = {this.state.no_of_males}
                  <br></br>
                  Other = {this.state.no_of_others}</td>
                </tr>
                <tr>
                  <td><b>Number of newcomer youth</b></td>
                  <td></td>
                </tr>
                </tbody>
                </Table>
              
        <BarChart data={chartData} options={chartOptions} />
      </div>
    )
  }
}
