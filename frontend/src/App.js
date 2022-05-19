import React from 'react';

// components
import TopNavbar from './components/layouts/TopNavbar'
import Footer from './components/layouts/Footer'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { blue, pink } from '@mui/material/colors'

import routes from "./routes";

// style
import './stylesheets/App.scss';

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
