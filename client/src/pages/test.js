import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthBtn } from '../components/Button';
import logo from '../logo.svg';
import axios from 'axios';
import '../App.css';
import { Instructotron } from '../components/Instructotron';

class Test extends Component {
  // Set the initial state values
  state = {
    username: '',
    loading: true,
    loggedIn: false,
    loginError: false
  };

  async componentDidMount() {
    await axios
      .get('/user/info', {
        params: {
          username: this.props.match.params.username
        }
      })
      .then(response => {
        this.setState({
          loading: false,
          loggedIn: true,
          username: response.data.username
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          loading: false,
          loginError: true
        });
      });
  }

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
    const { username, loading, loggedIn } = this.state;
    if (loading) {
      return (
        <Instructotron>
          <h1>Loading...</h1>
        </Instructotron>
      );
    }
    else if (!loggedIn) {
      return <Redirect to="/user/signin" />;
    } else {
      return (
        <div className="App">
          <header className="App-header">
          <h1>Welcome, {username}</h1>
            <img src={logo} className="App-logo" alt="logo" />
            <AuthBtn
              onClick={this.handleLogout}
            >
              Logout
          </AuthBtn>
            <AuthBtn
              onClick={() => this.handleScrape()}>
              Scrape
          </AuthBtn>
          </header>

        </div>
      );
    }
  }
}

export default Test;