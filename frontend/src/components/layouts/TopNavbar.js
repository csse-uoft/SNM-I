import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {AppBar, Toolbar, Typography, Menu, MenuItem, ListItemIcon} from '@mui/material';
import {IconButton} from "@mui/material";
import { logout } from '../../api/auth';
import { UserContext } from "../../context";

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import ReportIcon from '@mui/icons-material/Report';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';

const ITEM_HEIGHT = 48;

// const StyledTabs = styled(Tabs)({
//   '& .MuiTabs-indicator': {
//     display: 'flex',
//     justifyContent: 'center',
//     backgroundColor: '#ccc',
//     transition: 'none',
//   },
// });

// const StyledTab = styled(Tab)(({theme}) => ({
//   textTransform: 'none',
//   fontWeight: theme.typography.fontWeightRegular,
//   fontSize: theme.typography.pxToRem(15),
//   marginRight: theme.spacing(1),
//   minWidth: 60,
//   color: 'rgba(255, 255, 255, 0.8)',
//   '&.Mui-selected': {
//     color: '#fff',
//     fontWeight: 500,
//     backgroundColor: '#cccccc26',
//   },
// }));

// function NavTab(props) {
//   const history = useHistory();
//   return <StyledTab {...props} onClick={() => history.push(props.value)}/>
// }

function TopNavBar() {
  const history = useHistory();
  const userContext = useContext(UserContext);
  const isLoggedin = !!userContext.email;
  const tabNames = ['/clients', '/services', '/goods', '/providers', '/reporting'];
  const [value, setValue] = useState(
    tabNames.indexOf(history.location.pathname) !== -1 ? history.location.pathname : false,
  );

  // useEffect(() => {
  //   setValue(tabNames.indexOf(history.location.pathname) !== -1 ? history.location.pathname : false);
  // }, [history.location.pathname, tabNames]);

  // const tabOnChange = (e, newValue) => {
  //   setValue(newValue);
  //   history.push(newValue);
  // };

  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open1 = Boolean(anchorEl1);
  const open2 = Boolean(anchorEl2);

  const handleClick1 = event => {setAnchorEl1(event.currentTarget);};
  const handleClose1 = () => {setAnchorEl1(null);};
  const handleClick2 = event => {setAnchorEl2(event.currentTarget);};
  const handleClose2 = () => {setAnchorEl2(null);};

  const handleLogout = () => {isLoggedin ? logout() : history.push('/login')};
  const handleLink = link => () => {history.push(link);};

  return (
    <AppBar position="fixed" sx={{backgroundColor: 'rgb(39, 44, 52)'}}>
      <Toolbar variant="dense">
        {isLoggedin ? (
          // <StyledTabs sx={{flexGrow: 2}} value={value} onChange={tabOnChange} variant="scrollable"
          //             indicatorColor='secondary'>
          //   <NavTab label="Clients" value="/clients"/>
          //   <NavTab label="Services" value="/services"/>
          //   <NavTab label="Goods" value="/goods"/>
          //   <NavTab label="Providers" value="/providers"/>
          //   <NavTab label="Reporting" value="/reporting"/>
          //   <Tab sx={{display: 'none'}} label="" value="none"/>
          // </StyledTabs>
            <div style={{flexGrow: 1}}>
              <IconButton
                  onClick={handleClick1}
                  size="small"
                  style={{color: 'white'}}
              >
                <MenuIcon/>
              </IconButton>
              <Menu
                  id="function-menu"
                  anchorEl={anchorEl1}
                  keepMounted
                  open={open1}
                  onClose={handleClose1}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: 150,
                    },
                  }}
              >
                <MenuItem onClick={handleLink(`/clients`)}>
                  <ListItemIcon>
                    <FamilyRestroomIcon fontSize="medium" sx={{ color:'black' }}/>
                  </ListItemIcon>
                  <Typography variant="inherit">Clients</Typography>
                </MenuItem>

                <MenuItem onClick={handleLink(`/services`)}>
                  <ListItemIcon>
                    <LocationCityIcon fontSize="medium" sx={{ color:'black' }}/>
                  </ListItemIcon>
                  <Typography variant="inherit">Services</Typography>
                </MenuItem>

                <MenuItem onClick={handleLink(`/goods`)}>
                  <ListItemIcon>
                    <BusinessCenterIcon fontSize="medium" sx={{ color:'black' }}/>
                  </ListItemIcon>
                  <Typography variant="inherit">Goods</Typography>
                </MenuItem>

                <MenuItem onClick={handleLink(`/providers`)}>
                  <ListItemIcon>
                    <GroupsIcon fontSize="medium" sx={{ color:'black' }}/>
                  </ListItemIcon>
                  <Typography variant="inherit">Providers</Typography>
                </MenuItem>

                <MenuItem onClick={handleLink(`/reporting`)}>
                  <ListItemIcon>
                    <ReportIcon fontSize="medium" sx={{ color:'black' }}/>
                  </ListItemIcon>
                  <Typography variant="inherit">Reporting</Typography>
                </MenuItem>

              </Menu>
            </div>
        ) : null}

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SNM-I
        </Typography>


        {isLoggedin && (
            <div>
              <IconButton
                  onClick={handleClick2}
                  size="small"
                  style={{color: 'white'}}
              >
                <AccountCircleSharpIcon/>
              </IconButton>
              <Menu
                  id="user-menu"
                  anchorEl={anchorEl2}
                  keepMounted
                  open={open2}
                  onClose={handleClose2}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: 150,
                    },
                  }}
              >
                <MenuItem onClick={handleLink(`/dashboard`)}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="medium" sx={{ color:'black' }}/>
                  </ListItemIcon>
                  <Typography variant="inherit">Dashboard</Typography>
                </MenuItem>

                <MenuItem onClick={handleLink(`/profile`)}>
                  <ListItemIcon>
                    <ManageAccountsIcon fontSize="medium" sx={{ color:'black' }}/>
                  </ListItemIcon>
                  <Typography variant="inherit">Profile</Typography>
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="medium" sx={{ color:'black' }}/>
                  </ListItemIcon>
                  <Typography variant="inherit">
                    {isLoggedin ? 'Log out' : 'Login'}
                  </Typography>
                </MenuItem>
              </Menu>
            </div>
        )}

      </Toolbar>
    </AppBar>
  )
}

export default TopNavBar;
