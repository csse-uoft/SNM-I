import React, { Component } from 'react';

// components
import TopNavbar from './components/layouts/TopNavbar'
import Footer from './components/layouts/Footer'
import routes from "./routes";

// style
import './stylesheets/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TopNavbar />

        {routes}
        <Footer />
      </div>
    );
  }
}
export default App;
