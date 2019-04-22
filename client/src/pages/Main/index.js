import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Instructotron } from '../../Components/Instructotron';
import Navbar from '../../Components/Navbar';
import Home from '../Home';
import Events from '../Events';

class Main extends Component {
  // Set the initial state values
  state = {
    username: '',
    currentPage: 'Home',
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

  // Function to handle Sidebar Navigation
  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  // Function to handle rendering the correct walker page from Sidebar Nav
  renderPage = () => {
    switch (this.state.currentPage) {
      case "Home": return <Home
        username={this.state.username}
      />;
      case "Events": return <Events />;
      default: return <Home
        username={this.state.username}
      />;
    }
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
        <Instructotron height="200px">
          <h1>Loading...</h1>
        </Instructotron>
      );
    }
    else if (!loggedIn) {
      return <Redirect to="/user/signin" />;
    } else {
      return (
        <div>
          <Navbar
            username={username}
            currentPage={this.state.currentPage}
            handlePageChange={this.handlePageChange}
            handleLogout={this.handleLogout}
          />
          <div className="main-content">
            {this.renderPage()}
          </div>
        </div>
      );
    }
  }
}

export default Main;