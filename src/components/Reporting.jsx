import React, { Component } from 'react';
import { Bar as BarChart } from 'react-chartjs';
import {chart} from 'chart.js';
import { Pie as PieChart } from 'react-chartjs';
import { Table, Label, Glyphicon, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { serverHost } from '../store/defaults.js';

export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_clients: 0,
      no_of_females: 0,
      no_of_males: 0,
      no_of_others: 0,
      year134: 0, 
      year145: 0, 
      year156: 0, 
      year167: 0, 
      year178: 0, 
      year189: 0, 
      year190: 0,
      year201: 0, 
      year212: 0, 
      year223: 0,
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
    .then(data => this.setState({
      total_clients: data.total_clients, 
      no_of_females: data.total_females,
      no_of_males: data.total_males, 
      no_of_others: data.total_others, 
      year134: data.year134, 
      year145: data.year145, 
      year156: data.year156, 
      year167: data.year167, 
      year178: data.year178, 
      year189: data.year189, 
      year190: data.year190,
      year201: data.year201, 
      year212: data.year212, 
      year223: data.year223
    }));  
  }

  render() {

    const chartData = {
      labels: [
        "1931-1940", 
        "1941-1950", 
        "1951-1960", 
        "1961-1970", 
        "1971-1980", 
        "1981-1990", 
        "1991-2000", 
        "2001-2010", 
        "2011-2020", 
        "2021-2030"
      ],
      datasets: [{
        data: [this.state.year134, this.state.year145, this.state.year156, this.state.year167, this.state.year178
        , this.state.year189, this.state.year190, this.state.year201, this.state.year212, this.state.year223],
        color: ["#FF5A5E", "#FF5A5E", "#FF5A5G"]
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
              <b>Total = {this.state.total_clients}</b>
              <br></br>
              <b>Female = {this.state.no_of_females}</b>
              <br></br>
              <b>Male = {this.state.no_of_males}</b>
              <br></br>
              <b>Other = {this.state.no_of_others}</b></td>
            </tr>
            <tr>
              <td><b>Variation of clients by birth year</b></td>
              <td><BarChart data={chartData} options={chartOptions} />
              <br></br>
              <b>Clients born from 1931 to 1940 = {this.state.year134}</b>
              <br></br>
              <b>Clients born from 1941 to 1950 = {this.state.year145}</b>
              <br></br>
              <b>Clients born from 1951 to 1960 = {this.state.year156}</b>
              <br></br>
              <b>Clients born from 1961 to 1970 = {this.state.year167}</b>
              <br></br>
              <b>Clients born from 1971 to 1980 = {this.state.year178}</b>
              <br></br>
              <b>Clients born from 1981 to 1990 = {this.state.year189}</b>
              <br></br>
              <b>Clients born from 1991 to 2000 = {this.state.year190}</b>
              <br></br>
              <b>Clients born from 2001 to 2010 = {this.state.year201}</b>
              <br></br>
              <b>Clients born from 2011 to 2020 = {this.state.year212}</b>
              <br></br>
              <b>Clients born from 2021 to 2030 = {this.state.year223}</b></td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}
