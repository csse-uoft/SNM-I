import _ from 'lodash';
import React, { Component } from 'react';
import { Bar as BarChart, Pie as PieChart } from 'react-chartjs';
import { Table, Glyphicon, Button } from 'react-bootstrap';
import { serverHost } from '../store/defaults.js';
import SelectField from './shared/SelectField';
// styles
import '../stylesheets/Reporting.scss';

const START_YEARS = [1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011]

export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_clients: 0,
      number_of_clients_by_gender: {},
      number_of_clients_by_birth_year: {},
      number_of_clients_by_marital_status: {},
      number_of_clients_by_language: {},
      number_of_providers_by_status: {},
      number_of_providers_by_type: {},
      number_of_individual_providers_by_category: {},
      selectedCategory: '',
      selectedAttribute: '',
    }
    this.handleSelectChange = this.handleSelectChange.bind(this);
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
          number_of_clients_by_marital_status: data.number_of_clients_by_marital_status,
          number_of_clients_by_language: data.number_of_clients_by_language,
          number_of_providers_by_status: data.number_of_providers_by_status,
          number_of_providers_by_type: data.number_of_providers_by_type,
          number_of_individual_providers_by_category: data.number_of_individual_providers_by_category
        })
      }
    );
  }

  handleSelectChange(e) {
    this.setState({ [e.target.id]: e.target.value })
  }

  render() {
    const reportingCategoryOptions = ['Clients', 'Providers', 'Services', 'Matches']

    const attributeOptions = {
      'Clients': ['Birth Year', 'Gender', 'Language', 'Marital Status'],
      'Providers': ['Individuals by Category', 'Status', 'Type'],
      'Services': ['Category', 'Type'],
      'Matches': ['Time between selected and matched', 'Time between selected and fulfilled']

    }

    const year_labels = _.map(START_YEARS, (start_year) => {
      return `${start_year}-${start_year + 9}`
    });

    const barChartDataBirthYear = {
      labels: year_labels,
      datasets: [{
        data: Object.values(this.state.number_of_clients_by_birth_year),
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

    const barChartDataLanguage = {
      labels: Object.keys(this.state.number_of_clients_by_language),
      datasets: [{
        data: Object.values(this.state.number_of_clients_by_language),
      }]
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

    const pieChartDataProviderStatus = [
      {
        value: this.state.number_of_providers_by_status["Internal"],
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Internal"
      },
      {
        value: this.state.number_of_providers_by_status["External"],
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "External"
      }
    ]

        const pieChartDataIndividualProviderCategory = [
      {
        value: this.state.number_of_individual_providers_by_category["Volunteer/Goods Donor"],
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Volunteer/Goods Donor"
      },
      {
        value: this.state.number_of_individual_providers_by_category["Professional Service Provider"],
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Professional Service Provider"
      }
    ]

    const pieChartDataProviderType = [
      {
        value: this.state.number_of_providers_by_type["Individual"],
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Individual"
      },
      {
        value: this.state.number_of_providers_by_type["Organization"],
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Organization"
      }
    ]

    const barChartDataMaritalStatus = {
      labels: Object.keys(this.state.number_of_clients_by_marital_status),
      datasets: [{
        data: Object.values(this.state.number_of_clients_by_marital_status),
      }]
    }

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
        <SelectField
          id='selectedCategory'
          componentClass="select"
          label='Get a report on'
          value={this.state.selectedCategory}
          options={reportingCategoryOptions}
          onChange={this.handleSelectChange}
        />
        <br></br>
        <br></br>
        <SelectField
          id='selectedAttribute'
          componentClass="select"
          label='Select attribute'
          value={this.state.selectedAttribute}
          options={(this.state.selectedCategory !== '')
            ? attributeOptions[this.state.selectedCategory]
            : []}
          onChange={this.handleSelectChange}
        />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        {(this.state.selectedCategory === 'Clients' && this.state.selectedAttribute === 'Gender') &&
          <GenderStats
            data={pieChartDataGender}
            options={pieChartOptions}
            totalClientsCount={this.state.total_clients}
            ClientsCountByGender={this.state.number_of_clients_by_gender}
          />
        }
        {(this.state.selectedCategory === 'Clients' && this.state.selectedAttribute ==='Language') &&
          <LanguageStats
            data={barChartDataLanguage}
            options={barChartOptions}
            totalClientsCount={this.state.total_clients}
            ClientsCountByLanguage={this.state.number_of_clients_by_language}
          />
        }
        {(this.state.selectedCategory === 'Clients' && this.state.selectedAttribute === 'Marital Status') &&
          <MaritalStatusStats
            data={barChartDataMaritalStatus}
            options={barChartOptions}
            totalClientsCount={this.state.total_clients}
            ClientsCountByMaritalStatus={this.state.number_of_clients_by_marital_status}
          />
        }
        {(this.state.selectedCategory === 'Clients' && this.state.selectedAttribute === 'Birth Year') &&
          <BirthYearStats
            data={barChartDataBirthYear}
            options={barChartOptions}
            ClientsCountByBirthYear={this.state.number_of_clients_by_birth_year}
          />
        }
        {(this.state.selectedCategory === 'Providers' && this.state.selectedAttribute === 'Status') &&
          <ProviderStatusStats
            data={pieChartDataProviderStatus}
            options={pieChartOptions}
            ProvidersCountByStatus={this.state.number_of_providers_by_status}
          />
        }
        {(this.state.selectedCategory === 'Providers' && this.state.selectedAttribute === 'Type') &&
          <ProviderTypeStats
            data={pieChartDataProviderType}
            options={pieChartOptions}
            ProvidersCountByType={this.state.number_of_providers_by_type}
          />
        }
        {(this.state.selectedCategory === 'Providers' && this.state.selectedAttribute === 'Individuals by Category') &&
          <IndividualProviderCategoryStats
            data={pieChartDataIndividualProviderCategory}
            options={pieChartOptions}
            IndividualProvidersCountByCategory={this.state.number_of_individual_providers_by_category}
          />
        }
      </div>
    );
  }
}

function GenderStats({ data, options, totalClientsCount, ClientsCountByGender}) {
  return (
    <Table bordered condensed className="profile-table">
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

function ProviderStatusStats({ data, options, ProvidersCountByStatus}) {
  return (
    <Table bordered condensed className="profile-table">
      <tbody>
        <tr>
          <td><b>Breakdown of providers by Status</b></td>
          <td>
            <PieChart data={data} options={options} />
            {
              _.map(ProvidersCountByStatus, (count, status) => {
                return (
                  <div key={status}>
                    <b>{status} = {count}</b>
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

function IndividualProviderCategoryStats({ data, options, IndividualProvidersCountByCategory}) {
  return (
    <Table bordered condensed className="profile-table">
      <tbody>
        <tr>
          <td><b>Breakdown of individual providers by Category</b></td>
          <td>
            <PieChart data={data} options={options} />
            {
              _.map(IndividualProvidersCountByCategory, (count, status) => {
                return (
                  <div key={status}>
                    <b>{status} = {count}</b>
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

function ProviderTypeStats({ data, options, ProvidersCountByType}) {
  return (
    <Table bordered condensed className="profile-table">
      <tbody>
        <tr>
          <td><b>Breakdown of providers by type</b></td>
          <td>
            <PieChart data={data} options={options} />
            {
              _.map(ProvidersCountByType, (count, status) => {
                return (
                  <div key={status}>
                    <b>{status} = {count}</b>
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

function LanguageStats({ data, options, ClientsCountByLanguage}) {
  return (
    <Table bordered condensed className="profile-table">
      <tbody>
        <tr>
          <td><b>Breakdown of clients by Language</b></td>
          <td>
            <BarChart data={data} options={options} />
            {
              _.map(ClientsCountByLanguage, (count, first_language) => {
                return (
                  <div key={first_language}>
                    <b>{first_language} = {count}</b>
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
function MaritalStatusStats({ data, options, ClientsCountByMaritalStatus}) {
  return (
    <Table bordered condensed className="profile-table">
      <tbody>
        <tr>
          <td><b>Breakdown of clients by Marital Status</b></td>
          <td>
            <BarChart data={data} options={options} />
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
    <Table bordered condensed className="profile-table">
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
