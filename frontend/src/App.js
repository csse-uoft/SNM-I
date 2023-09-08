import React, {useState, useEffect} from 'react';

// components
import TopNavbar from './components/layouts/TopNavbar'
import Footer from './components/layouts/Footer'
import {createTheme, ThemeProvider, StyledEngineProvider, Button} from '@mui/material';
import {blue, pink} from '@mui/material/colors'

import routes from "./routes";
import {UserContext, getUserContext, defaultUserContext} from './context';
import {SnackbarProvider, useSnackbar} from 'notistack';
import {logout} from "./api/auth";
import {useLocation, useNavigate} from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {main: blue[700]},
    secondary: pink,
  },
});

export default function App() {
  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <SnackbarProvider>
          <ThemeProvider theme={theme}>
            <MainComponent/>
          </ThemeProvider>
        </SnackbarProvider>
      </StyledEngineProvider>
    </div>
  );
}

function MainComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const {enqueueSnackbar} = useSnackbar();
  const [logoutTimer, setLogoutTimer] = useState(0);
  const [userContext, setUserContext] = useState({
      ...getUserContext(),
      updateUser: (user) => {
        localStorage.setItem('userContext', JSON.stringify(user));
        setUserContext(state => ({...state, ...user}));
      },
      logout: async (message, navigateToLogin = true) => {
        enqueueSnackbar(message || 'logging out...');
        await logout();
        userContext.updateUser(defaultUserContext);
        if (logoutTimer) clearTimeout(logoutTimer);
        setLogoutTimer(0);
        if (location.pathname !== '/login' && navigateToLogin) setTimeout(() => navigate('/login'));
      }
    }
  );

  if (!logoutTimer && userContext.expiresAt) {
    setLogoutTimer(setTimeout(() => {
      userContext.logout("Automatic logout due to session expired.", false);
    }, userContext.expiresAt - new Date()));
  }

  return <UserContext.Provider value={userContext}>
    <TopNavbar/>
    <div style={{paddingTop: 50, paddingBottom: 22}}>
      {/*<Breadcurum/>*/}
      {routes}
    </div>
    <Footer/>
  </UserContext.Provider>
}
