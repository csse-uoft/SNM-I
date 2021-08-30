import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button, Tabs, Tab } from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import withStyles from '@material-ui/styles/withStyles';
import { Link } from "../shared";

// redux
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/actions/authAction.js';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    transition: 'none',
  },
})(props => <Tabs {...props} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    minWidth: 60,
  },
}))(({to, ...props}) => <Tab {...props}/>);

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'rgb(39, 44, 52)'
  },
  title: {
    paddingRight: 20,
    whiteSpace: 'pre',
    color: 'white',
    textDecorationLine: 'none',
  },
  rightButtons: {
    marginLeft: 'auto',
    textDecorationLine: 'none',
    whiteSpace: 'pre'
  },
}));

function TopNavBar() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {isLoggedin} = useSelector(state => state.auth);
  const tabNames = ['/clients', '/services', '/goods', '/providers', '/reporting'];
  const [value, setValue] = useState(
    tabNames.indexOf(history.location.pathname) !== -1 ? history.location.pathname : false,
  );

  useEffect(() => {
    setValue(tabNames.indexOf(history.location.pathname) !== -1 ? history.location.pathname : false);
  }, [history.location.pathname, tabNames]);

  const tabOnChange = (e, newValue) => {
    setValue(newValue);
    history.push(newValue);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar variant="dense">
        <Link to={isLoggedin ? "/dashboard" : "/"} className={classes.title}>
          <Typography variant="h6">
            Dashboard
          </Typography>
        </Link>

        {isLoggedin ? (
          <StyledTabs value={value} onChange={tabOnChange} variant="scrollable">
            <StyledTab label="Clients" value="/clients"/>
            <StyledTab label="Services" value="/services"/>
            <StyledTab label="Goods" value="/goods"/>
            <StyledTab label="Providers" value="/providers"/>
            <StyledTab label="Reporting" value="/reporting"/>
          </StyledTabs>
        ) : null}

        <Button color="inherit" className={classes.rightButtons}
                onClick={() => isLoggedin ? dispatch(logout()) : history.push('/login')}>
          {isLoggedin ? 'Log out' : 'Login'}
        </Button>

      </Toolbar>
    </AppBar>
  )
}

export default TopNavBar;
