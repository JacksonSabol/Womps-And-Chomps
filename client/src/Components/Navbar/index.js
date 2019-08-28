import React, { useState, useEffect } from "react";
import './index.css';
import NavbarHamburger from './hamburger';
import { NavbarItem } from '../Button';

const Navbar = (props) => {
  // Set the initial state value for responsive hamburger menu
  const [toggled, setToggled] = useState(false);

  // Close the navbar every time the "page" changes
  useEffect(() => {
    setToggled(false);
  }, [props.currentPage]);

  const iconToggled = toggled ? "toggled" : "",
    navbarToggled = toggled ? "open" : "";

  return (
    <nav className="navbar">
      <p className="welcome-message">Welcome, {props.username}!</p>
      <NavbarHamburger toggled={iconToggled} onClick={() => setToggled(!toggled)} />
      <div className={`navbar-nav ${navbarToggled}`}>
        <a href="/" className="home-logo">{`W&C`}</a>
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
          onClick={() => props.handlePageChange("Favorites")}
        >
          Favorites
          </NavbarItem>
        <NavbarItem
          onClick={() => props.handlePageChange("HomeAlpha")}
        >
          Home* (Alpha)
          </NavbarItem>
        <NavbarItem
          onClick={() => props.handleLogout()}
        >
          Logout
          </NavbarItem>
      </div>
    </nav>
  );
};

export default Navbar;
