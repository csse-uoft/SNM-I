import React, { Component } from 'react';
import TR from '../shared/TR';

import { torontoCoordinates, serverHost } from '../../store/defaults.js';

import MatchedServices from './MatchedServices';
import ServiceList from './ServiceList';
import ServiceSearchBar from './ServiceSearchBar';

// redux
import { connect } from 'react-redux'
import { fetchNeed } from '../../store/actions/needActions.js'

import { Container, Row, Col, Table, Tabs, Tab } from 'react-bootstrap';
// import { Grid, Table, Tabs, Tab } from "@mui/material";
// import { Col, Label, Row} from 'react-bootstrap';
// import SearchTabs from './NeedSearchTabs'

// import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import { Typography } from '@material-ui/core';
// import Box from '@material-ui/core/Box';


class Need extends Component {
  constructor(props) {
    super(props);

    const need = props.needsById[props.match.params.need_id];
    this.state = {
      searchResult: [],
      location: props.client.address ? { lat: parseFloat(props.client.address.lat), lng: parseFloat(props.client.address.lng) }: torontoCoordinates,
      recommendedServices: (need && need.recommended_services) || []
    }

    this.handleSearchService = this.handleSearchService.bind(this);
    this.handleSearchRecommendedServices = this.handleSearchRecommendedServices.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.need_id
    this.props.dispatch(fetchNeed(id, need => {
      this.setState({ recommendedServices: need.recommended_services })
    }));
  }

  handleSearchService(queryTerm, location) {
    const url = serverHost + '/services/search?query_term=' + queryTerm + '&location=' + location;
    fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }),
      })
      .then(response => response.json())
      .then(json => {
        this.setState({ searchResult: json.data, location: json.location })
      }
    );
  }

  handleSearchRecommendedServices(location, needId) {
    const url = serverHost + '/needs/' + needId + '/recommended_services?location=' + location;
    fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }),
      })
      .then(response => response.json())
      .then(json => {
        this.setState({ recommendedServices: json.data, location: json.location })
      }
    );
  }

  render() {
    const p = this.props,
          id = p.match.params.need_id,
          need = p.needsById[id],
          client = p.client

    function DeletedLabel({ is_deleted }) {
      if (is_deleted) {
        return (
          <h4>
            <div style={{color: 'rgb(213,87,79)'}}>Deleted</div>
          </h4>
        );
      } else {
        return null;
      }
    }

    function UrgentLabel({ is_urgent }) {
      if (is_urgent) {
        return (
          <h4>
            <div style={{color: 'rgb(213,87,79)'}}>Urgent</div>
          </h4>
        );
      } else {
        return null;
      }
    }

    // function TabPanel(props) {
    //   const { children, value, index, ...other } = props;
    
    //   return (
    //     <div
    //       role="tabpanel"
    //       hidden={value !== index}
    //       id={`simple-tabpanel-${index}`}
    //       aria-labelledby={`simple-tab-${index}`}
    //       {...other}
    //     >
    //       {value === index && (
    //         <Box p={3}>
    //           <Typography>{children}</Typography>
    //         </Box>
    //       )}
    //     </div>
    //   );
    // }
    
    // TabPanel.propTypes = {
    //   children: PropTypes.node,
    //   index: PropTypes.any.isRequired,
    //   value: PropTypes.any.isRequired,
    // };
    
    // function a11yProps(index) {
    //   return {
    //     id: `simple-tab-${index}`,
    //     'aria-controls': `simple-tabpanel-${index}`,
    //   };
    // }
    
    // const useStyles = makeStyles((theme) => ({
    //   root: {
    //     flexGrow: 1,
    //     backgroundColor: theme.palette.background.paper,
    //   },
    // }));
    
    // function SearchTabs() {
    //   const classes = useStyles();
    //   const [value, setValue] = React.useState(0);
    
    //   const handleChange = (event, newValue) => {
    //     setValue(newValue);
    //   };
    
    //   return (
    //     <div className={classes.root}>
    //       <AppBar position="static">
    //         <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
    //           <Tab label="Recommended Services" {...a11yProps(0)} />
    //           <Tab label="Search for Services" {...a11yProps(1)} />
    //         </Tabs>
    //       </AppBar>
    //       <TabPanel value={value} index={0}>
    //         recommended_services
    //       </TabPanel>
    //       <TabPanel value={value} index={1}>
    //         Search for Services content
    //       </TabPanel>
    //     </div>
    //   );
    // }

    // return (
      
    //   <Grid className="content">
    //     { need && need.loaded &&
    //     <React.Fragment>
    //       <Grid container>
    //         <DeletedLabel is_deleted={need.is_deleted} />
    //         <UrgentLabel is_urgent={need.is_urgent} />
    //         <Table striped bordered condensed hover>
    //           <tbody>
    //             <TR
    //               title="Type"
    //               value={need.type + need.matches.length}
    //             />
    //             <TR
    //               title="Category"
    //               value={need.category}
    //             />
    //             <TR
    //               title="Needed By"
    //               value={need.needed_by}
    //             />
    //             <TR
    //               title="Description"
    //               value={need.description}
    //             />
    //             <TR
    //               title="Condition"
    //               value={need.condition}
    //             />
    //             <TR
    //               title="Status"
    //               value={need.status}
    //             />
    //             <TR
    //               title="Languages"
    //               value={(need.languages || []).join(', ')}
    //             />
    //           </tbody>
    //         </Table>
    //       </Grid>
    //       <div>
    //       {(need.matches.length > 0) &&
    //         <MatchedServices
    //           clientId={client.id}
    //           matches={need.matches}
    //         />
    //       }
    //       </div>
    //       <Grid container>
    //         <SearchTabs />
    //       </Grid>
    //     </React.Fragment>
    //     }
    //   </Grid>
    // )

    return (
      <Container className="content">
        { need && need.loaded &&
          <Row>
            <Col sm={12}>
              <h3>Need</h3>
            </Col>
            <Col sm={12}>
              <DeletedLabel is_deleted={need.is_deleted} />
              <UrgentLabel is_urgent={need.is_urgent} />
              <Table striped bordered condensed hover>
                <tbody>
                  <TR
                    title="Type"
                    value={need.type}
                  />
                  <TR
                    title="Category"
                    value={need.category}
                  />
                  <TR
                    title="Needed By"
                    value={need.needed_by}
                  />
                  <TR
                    title="Description"
                    value={need.description}
                  />
                  <TR
                    title="Condition"
                    value={need.condition}
                  />
                  <TR
                    title="Status"
                    value={need.status}
                  />
                  <TR
                    title="Languages"
                    value={(need.languages || []).join(', ')}
                  />
                </tbody>
              </Table>
            </Col>
            {(need.matches.length > 0) &&
              <MatchedServices
                clientId={client.id}
                matches={need.matches}
              />
            }
            <Col sm={12}>
              <Tabs defaultActiveKey={1} id="serviceList">
                <Tab eventKey={1} title="RecommendedServices">
                  <ServiceSearchBar
                    search={this.handleSearchRecommendedServices}
                    location={client.address}
                    needId={need.id}
                  />
                  {need.recommended_services && need.recommended_services.length > 0 &&
                    <ServiceList
                      need={need}
                      services={this.state.recommendedServices}
                      latlng={this.state.location}
                    />
                  }
                </Tab>
                <Tab eventKey={2} title="Search for Services">
                  <ServiceSearchBar
                    search={this.handleSearchService}
                    location={client.address}
                    enableQueryTerm
                  />
                  {this.state.searchResult && this.state.searchResult.length > 0 &&
                    <ServiceList
                      need={need}
                      services={this.state.searchResult}
                      latlng={this.state.location}
                    />
                  }
                </Tab>
              </Tabs>
            </Col>
          </Row>
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    needsById: state.needs.byId,
    client: state.clients.byId[state.needs.clientId]
  }
}

export default connect(
  mapStateToProps
)(Need);
