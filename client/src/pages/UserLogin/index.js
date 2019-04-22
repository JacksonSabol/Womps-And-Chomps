import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Background from '../../components/Background';
import { Instructotron } from "../../components/Instructotron";
import { AuthBtn } from "../../components/Button";
import { AuthInput } from "../../components/Form";
import axios from 'axios';
import './index.css';

class UserLogin extends Component {
    // Set the initial state values
    state = {
        username: '',
        password: '',
        loggedout: true,
        showError: false,
        loginError: false
    };
    handleInputChange = event => {
        // Get the value and name of the input which triggered the change
        const { name, value } = event.target;
        // Update the input's state
        this.setState({
            [name]: value
        });
    };

    handleLoginUser = event => {
        event.preventDefault();
        axios
            .post('/user/signin', {
                username: this.state.username,
                password: this.state.password
            })
            .then(response => {
                this.setState({
                    loggedout: false
                });
            })
            .catch(error => {
                console.log(error);
                if (error.response.data === "Unauthorized") {
                    this.setState({
                        showError: true,
                        loginError: true
                    });
                }
            });
    };

    render() {
        const {
            username,
            loggedout,
            showError,
            loginError
        } = this.state;

        if (loggedout) {
            return (
                <div>
                    <Background />
                    <Instructotron height={"370px"}>
                        <h1>Login</h1>
                        <a href="/" className="auth-link">Home </a>
                        <a href="/user/signup" className="auth-link">Register</a>
                        <form className="auth-form">
                            <label className="auth-label">Enter username:</label>
                            <AuthInput
                                type={"text"}
                                value={this.state.username}
                                onChange={this.handleInputChange}
                                name="username"
                                placeholder="Username (required)"
                            />
                            <label className="auth-label">Enter password:</label>
                            <AuthInput
                                type={"password"}
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                name="password"
                                placeholder="Password"
                            />
                            <AuthBtn
                                disabled={!(this.state.username && this.state.password)}
                                onClick={this.handleLoginUser}
                            >
                                Sign In
                                </AuthBtn>
                            {showError === true && loginError === true && (
                                <div className="auth-alert">
                                    <p className="form-alert">Incorrect username or password. Please try again or Signup</p>
                                    <a href="/user/signup">Signup</a>
                                </div>
                            )}
                        </form>
                    </Instructotron>
                </div>
            );
        } else {
            return <Redirect to={`/user/profile/${username}`} />;
        }
    }
}

export default UserLogin;
