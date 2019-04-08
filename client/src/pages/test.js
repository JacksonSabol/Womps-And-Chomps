import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { LogoutBtn } from '../components/Button';
import logo from '../logo.svg';
import axios from 'axios';
import '../App.css';

class Test extends Component {
  // Set the initial state values
  state = {
    username: '',
    loggedIn: true
  };

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

  handleLogout = () => {
    axios
      .post('/user/logout')
      .then(response => {
        if (response.status === 204) {
          this.setState({ loggedIn: false });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { loggedIn } = this.state;
    if (!loggedIn) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <LogoutBtn
              onClick={this.handleLogout}
            >
              Logout
          </LogoutBtn>
            <button onClick={() => this.handleScrape()}>
              Scrape
          </button>
          </header>

        </div>
      );
    }
  }
}

export default Test;