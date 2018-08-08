import _ from 'lodash';
import React, { Component } from 'react';
import { Bar as BarChart, Pie as PieChart } from 'react-chartjs';
import { Table, Glyphicon, Button } from 'react-bootstrap';
import { serverHost } from '../store/defaults.js';

// styles
import '../stylesheets/Reporting.css';

const START_YEARS = [1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011]

export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_clients: 0,
      number_of_clients_by_gender: {},
      number_of_clients_by_birth_year: {},
      number_of_clients_by_marital_status: {},
      type: false
    }
    this.updateType = this.updateType.bind(this);
  }

  componentWillMount() {
    const url = serverHost + '/reporting?years=' + START_YEARS;
    fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }),
      }).then(response => response.json())
      .then(data => {
        this.setState({
          total_clients: data.total_clients,
          number_of_clients_by_gender: data.number_of_clients_by_gender,
          number_of_clients_by_birth_year: data.number_of_clients_by_birth_year,
          number_of_clients_by_marital_status: data.number_of_clients_by_marital_status
        })
      }
    );
  }

  updateType(type) {
    this.setState({ type: type })
  }

  render() {
    const year_labels = _.map(START_YEARS, (start_year) => {
      return `${start_year}-${start_year + 9}`
    });

    const barChartData = {
      labels: year_labels,
      datasets: [{
        data: Object.values(this.state.number_of_clients_by_birth_year),
        color: [
          "#FF5A5E",
          "#FF5A5E",
          "#FF5A5G"
          ]
      }]
    }

    const barChartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }

    const pieChartDataGender = [
      {
        value: this.state.number_of_clients_by_gender["Female"],
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Female"
      },
      {
        value: this.state.number_of_clients_by_gender["Male"],
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Male"
      },
      {
        value: this.state.number_of_clients_by_gender["Other"],
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Other"
      }
    ]

    const pieChartDataMaritalStatus = [
      {
        value: this.state.number_of_clients_by_marital_status["Single"],
        color:"#F7464A",
        label: "Single"
      },
      {
        value: this.state.number_of_clients_by_marital_status["Married"],
        color: "#46BFBD",
        label: "Married"
      },
      {
        value: this.state.number_of_clients_by_marital_status["Common_Law"],
        color: "#FDB45C",
        label: "Common Law"
      },
      {
        value: this.state.number_of_clients_by_marital_status["Separated"],
        color:"#1E1D47",
        label: "Separated"
      },
      {
        value: this.state.number_of_clients_by_marital_status["Divorced"],
        color: "#A32FC2",
        label: "Divorced"
      },
      {
        value: this.state.number_of_clients_by_marital_status["Widowed"],
        color: "5EC22F",
        label: "Widowed"
      }
    ]

    const pieChartOptions = {
      maintainAspectRatio: false,
      responsive: false,
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 10
        }
      }
    }

    return (
      <div className="content client">
        <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
          <Glyphicon glyph="print" />
        </Button>
        <Table bordered condensed className="client-profile-table">
          <tbody>
            <tr>
              <td colSpan="1"><b>Available Statistics:</b></td>
            </tr>
            <tr>
              <td>
                <span
                  className="update-type-button"
                  onClick={e => this.updateType('gender')}
                >
                  Breakdown of clients by Gender
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span
                  className="update-type-button"
                  onClick={e => this.updateType('birthyear')}
                >
                  Distribution of clients by birth year
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span
                  className="update-type-button"
                  onClick={e => this.updateType('maritalstatus')}
                >
                  Breakdown of clients by Marital Status
                </span>
              </td>
            </tr>
          </tbody>
        </Table>
        {(this.state.type === 'gender') &&
          <GenderStats
            data={pieChartDataGender}
            options={pieChartOptions}
            totalClientsCount={this.state.total_clients}
            ClientsCountByGender={this.state.number_of_clients_by_gender}
          />
        }
        {(this.state.type === 'maritalstatus') &&
          <MaritalStatusStats
            data={pieChartDataMaritalStatus}
            options={pieChartOptions}
            totalClientsCount={this.state.total_clients}
            ClientsCountByMaritalStatus={this.state.number_of_clients_by_marital_status}
          />
        }
        {(this.state.type === 'birthyear') &&
          <BirthYearStats
            data={barChartData}
            options={barChartOptions}
            ClientsCountByBirthYear={this.state.number_of_clients_by_birth_year}
          />
        }
      </div>
    );
  }
}

function GenderStats({ data, options, totalClientsCount, ClientsCountByGender}) {
  return (
    <Table bordered condensed className="client-profile-table">
      <tbody>
        <tr>
          <td><b>Breakdown of clients by Gender</b></td>
          <td>
            <PieChart data={data} options={options} />
            <div>
              <b>Total = {totalClientsCount}</b>
            </div>
            {
              _.map(ClientsCountByGender, (count, gender) => {
                return (
                  <div key={gender}>
                    <b>{gender} = {count}</b>
                  </div>
                );
              })
            }
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

function MaritalStatusStats({ data, options, totalClientsCount, ClientsCountByMaritalStatus}) {
  return (
    <Table bordered condensed className="client-profile-table">
      <tbody>
        <tr>
          <td><b>Breakdown of clients by Marital Status</b></td>
          <td>
            <PieChart data={data} options={options} />
            <div>
              <b>Total = {totalClientsCount}</b>
            </div>
            {
              _.map(ClientsCountByMaritalStatus, (count, marital_status) => {
                return (
                  <div key={marital_status}>
                    <b>{marital_status} = {count}</b>
                  </div>
                );
              })
            }
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

function BirthYearStats({ data, options, ClientsCountByBirthYear }) {
  return (
    <Table bordered condensed className="client-profile-table">
      <tbody>
        <tr>
          <td><b>Distribution of clients by Birth Year</b></td>
          <td>
            <BarChart data={data} options={options} />
            {
              _.map(ClientsCountByBirthYear, (count, startYear) => {
                return (
                  <div key={startYear}>
                    <b>
                      Clients born between {startYear} and {parseInt(startYear, 10) + 9} = {count}
                    </b>
                  </div>
                );
              })
            }
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
