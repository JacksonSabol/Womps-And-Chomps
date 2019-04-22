import React, { Component } from 'react';
import { Instructotron } from "../../components/Instructotron";
import Background from '../../components/Background';
import './index.css';

class Splash extends Component {
    // Placeholder
    state = {
        loggedout: true
    };

    render() {
        return (
            <div>
                <Background />
                <Instructotron height={"300px"}>
                    <h1>Welcome to Womp and Chomp: electronic music event tracker.</h1>
                    <a href="/user/signin" className="auth-link">Login </a>
                    <a href="/user/signup" className="auth-link"> Register</a>
                </Instructotron>
            </div>
        );

    }
}

export default Splash;
