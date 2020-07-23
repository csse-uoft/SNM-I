import React from 'react';

// components
import TopNavbar from './components/layouts/TopNavbar'
import Footer from './components/layouts/Footer'
// import Breadcurum from './components/layouts/Breadcrumb';
import { createMuiTheme } from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'
import { ThemeProvider } from '@material-ui/core';

import routes from "./routes";

// style
import './stylesheets/App.scss';

const theme = createMuiTheme({
  palette: {
    primary: {main: blue[700]},
    secondary: pink,
  },
});

export default function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <TopNavbar/>
        <div style={{paddingTop: 50, paddingBottom: 22}}>
          {/*<Breadcurum/>*/}
          {routes}
        </div>
        <Footer/>
      </ThemeProvider>
    </div>
  );
}
