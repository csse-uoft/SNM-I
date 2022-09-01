import React, {useState, useContext, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppBar, Toolbar, Typography, Menu, MenuItem, ListItemIcon} from '@mui/material';
import {IconButton} from "@mui/material";
import {logout} from '../../api/auth';
import {UserContext, defaultUserContext} from "../../context";
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
import LoginIcon from '@mui/icons-material/Login';

const ITEM_HEIGHT = 48;

/**
 * This is the TopNavBar shows on every page.
 * @returns {JSX.Element}
 * @constructor
 */
function TopNavBar() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const id = userContext.id;
  const isLoggedin = !!userContext.email;

  const [anchorElLeft, setAnchorElLeft] = useState(null);
  const [anchorElRight, setAnchorElRight] = useState(null);
  const openLeft = Boolean(anchorElLeft);
  const openRight = Boolean(anchorElRight);

  const handleClickLeft = event => {
    setAnchorElLeft(event.currentTarget);
  };
  const handleCloseLeft = () => {
    setAnchorElLeft(null);
  };
  const handleClickRight = event => {
    setAnchorElRight(event.currentTarget);
  };
  const handleCloseRight = () => {
    setAnchorElRight(null);
  };

  const handleLink = useCallback(link => () => {
    setAnchorElLeft(null);
    setAnchorElRight(null);
    navigate(link);
  }, []);

  const handleLogout = async () => {
    if (isLoggedin)
      await logout();
    userContext.updateUser(defaultUserContext);
    setAnchorElLeft(null);
    setAnchorElRight(null);
    navigate('/login');
  }

  return (
    <AppBar position="fixed" sx={{backgroundColor: 'rgb(39, 44, 52)'}}>

      {/*Burger Menu*/}
      <Toolbar variant="dense">
        {isLoggedin ? (
          <div style={{flexGrow: 1}}>
            <IconButton
              onClick={handleClickLeft}
              size="small"
              style={{color: 'white'}}
            >
              <MenuIcon/>
            </IconButton>
            <Menu
              id="function-menu"
              anchorEl={anchorElLeft}
              keepMounted
              open={openLeft}
              onClose={handleCloseLeft}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 7,
                  width: 170,
                },
              }}
            >
              <MenuItem onClick={handleLink(`/clients`)}>
                <ListItemIcon>
                  <FamilyRestroomIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">Clients</Typography>
              </MenuItem>

              <MenuItem onClick={handleLink(`/services`)}>
                <ListItemIcon>
                  <LocationCityIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">Services</Typography>
              </MenuItem>

              <MenuItem onClick={handleLink(`/appointments`)}>
                <ListItemIcon>
                  <BusinessCenterIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">Appointments</Typography>
              </MenuItem>

              <MenuItem onClick={handleLink(`/referrals`)}>
                <ListItemIcon>
                  <BusinessCenterIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">Referrals</Typography>
              </MenuItem>

              <MenuItem onClick={handleLink(`/goods`)}>
                <ListItemIcon>
                  <BusinessCenterIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">Goods</Typography>
              </MenuItem>

              <MenuItem onClick={handleLink(`/providers`)}>
                <ListItemIcon>
                  <GroupsIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">Providers</Typography>
              </MenuItem>

              <MenuItem onClick={handleLink(`/reporting`)}>
                <ListItemIcon>
                  <ReportIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">Reporting</Typography>
              </MenuItem>

            </Menu>
          </div>
        ) : null}

        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          SNM-I
        </Typography>

        {/*The profile button containing dashboard, profile, logout/login*/}
        {isLoggedin ? (
          <div>
            <IconButton
              onClick={handleClickRight}
              size="small"
              style={{color: 'white'}}
            >
              <AccountCircleSharpIcon/>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorElRight}
              keepMounted
              open={openRight}
              onClose={handleCloseRight}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 150,
                },
              }}
            >
              <MenuItem onClick={handleLink(`/dashboard`)}>
                <ListItemIcon>
                  <DashboardIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">Dashboard</Typography>
              </MenuItem>

              <MenuItem onClick={handleLink('/profile/' + id + '/')}>
                <ListItemIcon>
                  <ManageAccountsIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">Profile</Typography>
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="medium" sx={{color: 'black'}}/>
                </ListItemIcon>
                <Typography variant="inherit">
                  {isLoggedin ? 'Log out' : 'Login'}
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LoginIcon fontSize="medium" sx={{color: 'white'}}/>
              </ListItemIcon>
              <Typography variant="inherit">
                {isLoggedin ? 'Log out' : 'Login'}
              </Typography>
            </MenuItem>
          </div>
        )}

      </Toolbar>
    </AppBar>
  )
}

export default TopNavBar;
