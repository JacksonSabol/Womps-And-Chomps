import React from 'react';

const NavbarHamgburger = ({ onClick, toggled }) => (
    <div className="navbar-hamburger">
        <div className={`navbar-toggle ${toggled}`}>
            <button type="button" className="navbar-toggler" onClick={onClick}>
                <span className="navbar-toggler-bar bar1"></span>
                <span className="navbar-toggler-bar bar2"></span>
                <span className="navbar-toggler-bar bar3"></span>
            </button>
        </div>
    </div>
);

export default NavbarHamgburger;