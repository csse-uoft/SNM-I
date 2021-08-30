import React from 'react';

// components
import TopNavbar from './components/layouts/TopNavbar'
import Footer from './components/layouts/Footer'
// import Breadcurum from './components/layouts/Breadcrumb';
import { createTheme, adaptV4Theme } from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors'
import { ThemeProvider, StyledEngineProvider } from '@material-ui/core';

import routes from "./routes";

// style
import './stylesheets/App.scss';

const theme = createTheme(adaptV4Theme({
  palette: {
    primary: {main: blue[700]},
    secondary: pink,
  },
}));

export default function App() {
  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <TopNavbar/>
          <div style={{paddingTop: 50, paddingBottom: 22}}>
            {/*<Breadcurum/>*/}
            {routes}
          </div>
          <Footer/>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}
