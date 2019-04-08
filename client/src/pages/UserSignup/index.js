import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from '../../components/Grid';
import { Jumbotron } from "../../components/Jumbotron";
import { FormBtn } from "../../components/Button";
import { Input } from "../../components/Form";
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
                    console.log(response);
                    this.setState({
                        unregistered: false,
                        showError: false,
                        loginError: false,
                        passwordError: false,
                    });
                })
                .catch(error => {
                    console.log(error.response)
                    console.log(error.response.data);
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
                <Container fluid>
                    <Row>
                        <Col size="md-6">
                            <Jumbotron>
                                <h1>Sign Up</h1>
                                <a href="/" className="auth-link">Home </a>
                                <a href="/user/signin" className="auth-link"> Signin</a>
                            </Jumbotron>
                            <form>
                                <label className="username-label">Choose a username:</label>
                                <Input
                                    type={"text"}
                                    value={this.state.username}
                                    onChange={this.handleInputChange}
                                    name="username"
                                    placeholder="Username (required)"
                                />
                                <label className="password-label">Choose a password:</label>
                                <Input
                                    type={"password"}
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    name="password"
                                    placeholder="Password"
                                />
                                <label className="password-label">Confirm password:</label>
                                <Input
                                    type={"password"}
                                    value={this.state.passwordConfirm}
                                    onChange={this.handleInputChange}
                                    name="passwordConfirm"
                                    placeholder="Confirm Password"
                                />
                                <FormBtn
                                    disabled={!(this.state.username && this.state.password && this.state.passwordConfirm)}
                                    onClick={this.handleRegisterUser}
                                >
                                    Signup
                                </FormBtn>
                                {showError === true && passwordError === true && (
                                    <div>
                                        <p className="form-alert">Passwords do not match.</p>
                                    </div>
                                )}
                                {showError === true && loginError === true && (
                                    <div>
                                        <p className="form-alert">That username is already taken. Please choose another, or login.</p>
                                        <p><a className="form-alert-login" href="/user/signin">Login</a></p>
                                    </div>
                                )}
                            </form>
                        </Col>
                    </Row>
                </Container>
            );
        } else {
            return <Redirect to={`/user/profile/${username}`} />;
        }
    }
}

export default UserSignup;
