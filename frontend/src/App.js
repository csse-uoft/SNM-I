import React, { useState } from 'react';

// components
import TopNavbar from './components/layouts/TopNavbar'
import Footer from './components/layouts/Footer'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { blue, pink } from '@mui/material/colors'

import routes from "./routes";
import { UserContext, getUserContext } from './context';

// style
import './stylesheets/App.scss';

const theme = createTheme({
  palette: {
    primary: {main: blue[700]},
    secondary: pink,
  },
});

export default function App() {

  const [userContext, setUserContext] = useState({
      ...getUserContext(),
      updateUser: (user) => {
        localStorage.setItem('userContext', JSON.stringify(user));
        setUserContext(state => ({...state, ...user}));
      },
    }
  );

  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <UserContext.Provider value={userContext}>
          <ThemeProvider theme={theme}>
            <TopNavbar/>
            <div style={{paddingTop: 50, paddingBottom: 22}}>
              {/*<Breadcurum/>*/}
              {routes}
            </div>
            <Footer/>
          </ThemeProvider>
        </UserContext.Provider>
      </StyledEngineProvider>
    </div>
  );
}
