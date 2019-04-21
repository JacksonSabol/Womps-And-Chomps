import React from "react";
import './index.css';
import { HomeBtn, NavbarItem } from '../Button';

function Navbar(props) {
  return (
    <nav className="navbar">
      <HomeBtn onClick={() => props.handlePageChange("Home")}>
        {/* <img src={logo} className="navbar-brand-logo" alt="^_^" /> */}
        Logo
      </HomeBtn>
      <div className="navbar-nav">
        <NavbarItem
          onClick={() => props.handlePageChange("Home")}
        >
          Home
          </NavbarItem>
        <NavbarItem
          onClick={() => props.handlePageChange("Events")}
        >
          Events
          </NavbarItem>
        <NavbarItem
          onClick={() => props.handleLogout()}
        >
          Logout
          </NavbarItem>
        <p className="welcome-message">Welcome, {props.username}!</p>
      </div>
    </nav>
  );
}

export default Navbar;
