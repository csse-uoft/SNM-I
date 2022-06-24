import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box } from '@mui/material';
import { Link } from "../shared";

import { logout } from '../../api/auth';
import styled from "@emotion/styled";
import { UserContext, defaultUserContext } from "../../context";

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
    backgroundColor: '#cccccc26',
  },
}));

function NavTab(props) {
  const history = useHistory();
  return <StyledTab {...props} onClick={() => history.push(props.value)}/>
}

function TopNavBar() {
  const history = useHistory();
  const userContext = useContext(UserContext);
  const isLoggedin = !!userContext.email;
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

  const handleLogout = async () => {
    if (isLoggedin)
      await logout();
    userContext.updateUser(defaultUserContext);
    history.push('/login');
  }

  return (
    <AppBar position="fixed" sx={{backgroundColor: 'rgb(39, 44, 52)'}}>
      <Toolbar variant="dense">
        {isLoggedin ? (
          <StyledTabs sx={{flexGrow: 2}} value={value} onChange={tabOnChange} variant="scrollable"
                      indicatorColor='secondary'>
            <NavTab label="Clients" value="/clients"/>
            <NavTab label="Services" value="/services"/>
            <NavTab label="Goods" value="/goods"/>
            <NavTab label="Providers" value="/providers"/>
            <NavTab label="Reporting" value="/reporting"/>
            <Tab sx={{display: 'none'}} label="" value="none"/>
          </StyledTabs>
        ) : null}

        {isLoggedin && (
          <Box sx={{
            paddingRight: '20px',
            whiteSpace: 'pre',
            textDecorationLine: 'none',
          }}>
            <Link to={"/dashboard"} onClick={() => setValue('none')}>
              <Typography>
                Dashboard
              </Typography>
            </Link>
          </Box>
        )}

        <Button color="inherit" onClick={handleLogout}
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
