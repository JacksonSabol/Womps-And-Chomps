import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from '../../components/Grid';
import { Jumbotron } from "../../components/Jumbotron";
import { FormBtn } from "../../components/Button";
import { Input } from "../../components/Form";
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
                console.log(response);
                this.setState({
                    loggedout: false,
                    showError: false,
                    loginError: false
                });
            })
            .catch(error => {
                console.log(error.response);
                console.log(error.response.data);
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
                <Container fluid>
                    <Row>
                        <Col size="md-6">
                            <Jumbotron>
                                <h1>Sign In</h1>
                                <a href="/" className="auth-link">Home </a>
                                <a href="/user/signup" className="auth-link"> Register</a>
                            </Jumbotron>
                            <form>
                                <label className="username-label">Enter username:</label>
                                <Input
                                    type={"text"}
                                    value={this.state.username}
                                    onChange={this.handleInputChange}
                                    name="username"
                                    placeholder="Username (required)"
                                />
                                <label className="password-label">Enter password:</label>
                                <Input
                                    type={"password"}
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    name="password"
                                    placeholder="Password"
                                />
                                <FormBtn
                                    disabled={!(this.state.username && this.state.password)}
                                    onClick={this.handleLoginUser}
                                >
                                    Signup
                                </FormBtn>
                                {showError === true && loginError === true && (
                                    <div>
                                        <p className="form-alert">Incorrect username or password. Please try again or Signup</p>
                                        <p><a className="form-alert-login" href="/user/signup">Signup</a></p>
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

export default UserLogin;
