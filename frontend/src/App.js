import React, {useState} from 'react';

// components
import TopNavbar from './components/layouts/TopNavbar'
import Footer from './components/layouts/Footer'
import {createTheme, ThemeProvider, StyledEngineProvider, Button} from '@mui/material';
import {blue, pink} from '@mui/material/colors'

import routes from "./routes";
import {UserContext, getUserContext, defaultUserContext} from './context';
import {SnackbarProvider, useSnackbar} from 'notistack';
import {logout} from "./api/auth";
import {useNavigate} from "react-router-dom";

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
  const {enqueueSnackbar} = useSnackbar();
  const [userContext, setUserContext] = useState({
      ...getUserContext(),
      updateUser: (user) => {
        localStorage.setItem('userContext', JSON.stringify(user));
        setUserContext(state => ({...state, ...user}));
      },
      logout: async () => {
        enqueueSnackbar('logging out...');
        await logout();
        userContext.updateUser(defaultUserContext);
        setTimeout(() => navigate('/login'));
      }
    }
  );
  return <UserContext.Provider value={userContext}>
    <TopNavbar/>
    <div style={{paddingTop: 50, paddingBottom: 22}}>
      {/*<Breadcurum/>*/}
      {routes}
    </div>
    <Footer/>
  </UserContext.Provider>
}
