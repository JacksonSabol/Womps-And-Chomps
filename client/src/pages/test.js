import React, { Component } from 'react';
import logo from '../logo.svg';
import axios from 'axios';
import '../App.css';

class Test extends Component {

  handleScrape = () => {
    axios
      .get('/api/events/scrape')
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button onClick={() => this.handleScrape()}>
            Scrape
          </button>
        </header>

      </div>
    );
  }
}

export default Test;