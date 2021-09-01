import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box } from '@material-ui/core';
import { Link } from "../shared";

// redux
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/actions/authAction.js';
import { styled } from "@material-ui/styles";

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    transition: 'none',
  },
});

const StyledTab = styled(Tab)(({theme}) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  minWidth: 60,
  color: 'rgba(255, 255, 255, 0.8)',
  '&.Mui-selected': {
    color: '#fff',
    fontWeight: 500,
  },
}));

function TopNavBar() {
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
    <AppBar position="fixed" sx={{backgroundColor: 'rgb(39, 44, 52)'}}>
      <Toolbar variant="dense">
        <Box sx={{
          paddingRight: '20px',
          whiteSpace: 'pre',
          textDecorationLine: 'none',
        }}>
          <Link to={isLoggedin ? "/dashboard" : "/"}>
            <Typography variant="h6">
              Dashboard
            </Typography>
          </Link>
        </Box>


        {isLoggedin ? (
          <StyledTabs value={value} onChange={tabOnChange} variant="scrollable" indicatorColor='secondary'>
            <StyledTab label="Clients" value="/clients"/>
            <StyledTab label="Services" value="/services"/>
            <StyledTab label="Goods" value="/goods"/>
            <StyledTab label="Providers" value="/providers"/>
            <StyledTab label="Reporting" value="/reporting"/>
          </StyledTabs>
        ) : null}

        <Button color="inherit" onClick={() => isLoggedin ? dispatch(logout()) : history.push('/login')}
                sx={{
                  marginLeft: 'auto',
                  textDecorationLine: 'none',
                  whiteSpace: 'pre'
                }}>
          {isLoggedin ? 'Log out' : 'Login'}
        </Button>

      </Toolbar>
    </AppBar>
  )
}

export default TopNavBar;
