import React, { Component } from 'react';
import { Container, Row, Col } from '../../components/Grid';
import { Jumbotron } from "../../components/Jumbotron";
import './index.css';

class Home extends Component {
    // Placeholder
    state = {
        loggedout: true
    };

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col size="md-6">
                        <Jumbotron>
                            <h1>Welcome to Womp and Chomp: electronic music event tracker.</h1>
                            <a href="/user/signin" className="auth-link">Login </a>
                            <a href="/user/signup" className="auth-link"> Register</a>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
        );

    }
}

export default Home;
