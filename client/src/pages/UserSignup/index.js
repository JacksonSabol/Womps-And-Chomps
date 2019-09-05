import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Background from '../../Components/Background';
import { Instructotron } from "../../Components/Instructotron";
import { AuthBtn } from "../../Components/Button";
import { AuthInput } from "../../Components/Form";
import axios from 'axios';
import './index.css';

class UserSignup extends Component {
    // Set the initial state values
    state = {
        username: '',
        password: '',
        passwordConfirm: '',
        unregistered: true,
        showError: false,
        passwordError: false,
        loginError: false
    };
    handleInputChange = event => {
        // Get the value and name of the input which triggered the change
        let value = event.target.value;
        const name = event.target.name;
        // Limit the length of the username
        if (name === "username") {
            value = value.substring(0, 25);
        }
        // Update the input's state
        this.setState({
            [name]: value
        });
    };

    handleRegisterUser = event => {
        event.preventDefault();
        if (this.state.password !== this.state.passwordConfirm) {
            this.setState({
                showError: true,
                passwordError: true
            });
        } else {
            axios
                .post('/user/signup', {
                    username: this.state.username,
                    password: this.state.password
                })
                .then(response => {
                    this.setState({
                        unregistered: false,
                        showError: false,
                        loginError: false,
                        passwordError: false,
                    });
                })
                .catch(error => {
                    if (error.response.data === "Unauthorized") {
                        this.setState({
                            showError: true,
                            loginError: true,
                            passwordError: false,
                        });
                    }
                });
        }
    };

    render() {
        const {
            username,
            unregistered,
            showError,
            passwordError,
            loginError
        } = this.state;

        if (unregistered) {
            return (
                <div>
                    <Background />
                    <Instructotron height={"450px"}>
                        <h1>Register</h1>
                        <a href="/" className="auth-link">Home </a>
                        <a href="/user/signin" className="auth-link">Login</a>
                        <form className="auth-form">
                            <label className="auth-label">Choose a username:</label>
                            <AuthInput
                                type={"text"}
                                value={this.state.username}
                                onChange={this.handleInputChange}
                                name="username"
                                placeholder="Username (required)"
                            />
                            <label className="auth-label">Choose a password:</label>
                            <AuthInput
                                type={"password"}
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                name="password"
                                placeholder="Password"
                            />
                            <label className="auth-label">Confirm password:</label>
                            <AuthInput
                                type={"password"}
                                value={this.state.passwordConfirm}
                                onChange={this.handleInputChange}
                                name="passwordConfirm"
                                placeholder="Confirm Password"
                            />
                            <AuthBtn
                                disabled={!(this.state.username && this.state.password && this.state.passwordConfirm)}
                                onClick={this.handleRegisterUser}
                            >
                                Sign Up
                                </AuthBtn>
                            {showError === true && passwordError === true && (
                                <div className="auth-alert">
                                    <p className="form-alert">Passwords do not match.</p>
                                </div>
                            )}
                            {showError === true && loginError === true && (
                                <div className="auth-alert">
                                    <p className="form-alert">That username is already taken. Please choose another, or login.</p>
                                    <a href="/user/signin">Login</a>
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

export default UserSignup;
