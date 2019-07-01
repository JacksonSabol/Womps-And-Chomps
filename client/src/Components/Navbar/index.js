import React, { Component } from "react";
import './index.css';
import { NavbarItem } from '../Button';

class Navbar extends Component {
  // Set the initial state value for responsive hamburger menu
  state = {
    toggled: false
  };

  toggleMenu = () => {
    this.setState(state => ({
      toggled: !state.toggled
    }));
  }

  render() {
    const iconToggled = this.state.toggled ? "toggled" : "";
    const navbarToggled = this.state.toggled ? "open" : "";
    return (
      <nav className="navbar">
        <p className="welcome-message">Welcome, {this.props.username}!</p>
        <div className="navbar-hamburger">
          <div className={`navbar-toggle ${iconToggled}`}>
            <button type="button" className="navbar-toggler" onClick={() => this.toggleMenu()}>
              <span className="navbar-toggler-bar bar1"></span>
              <span className="navbar-toggler-bar bar2"></span>
              <span className="navbar-toggler-bar bar3"></span>
            </button>
          </div>
        </div>
        <div className={`navbar-nav ${navbarToggled}`}>
          {/* <HomeBtn onClick={() => this.props.handlePageChange("Home")}>
            Logo
          </HomeBtn> */}
          <a href="/" className="home-logo">{`W&P`}</a>
          <NavbarItem
            onClick={() => this.props.handlePageChange("Home")}
          >
            Home
          </NavbarItem>
          <NavbarItem
            onClick={() => this.props.handlePageChange("Events")}
          >
            Events
          </NavbarItem>
          <NavbarItem
            onClick={() => this.props.handleLogout()}
          >
            Logout
          </NavbarItem>
        </div>
      </nav>
    );
  }
}

export default Navbar;
