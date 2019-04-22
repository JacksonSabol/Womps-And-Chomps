import React, { Component } from "react";
import './index.css';
import { HomeBtn, NavbarItem } from '../Button';

class Navbar extends Component {
  // Set the initial state value for responsive hamburger menu
  state = {
    toggled: false
  };

  toggleMenu = () => {
    const reverse = (this.state.toggled) ? false : true;
    this.setState({
      toggled: reverse
    });
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
          <HomeBtn onClick={() => this.props.handlePageChange("Home")}>
            {/* <img src={logo} className="navbar-brand-logo" alt="^_^" /> */}
            Logo
          </HomeBtn>
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
