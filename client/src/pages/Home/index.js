import React, { Component } from 'react';
import { AuthBtn } from '../../Components/Button';
import logo from '../../logo.svg';
import axios from 'axios';
import '../../App.css';

class Main extends Component {
    // Set the initial state values
    state = {
        username: this.props.username
    };

    handleScrape = () => {
        axios
            .get('/api/events/scrape')
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { username } = this.state;
        return (
            <div>
                <div className="App">
                    <header className="App-header">
                        <h1>Welcome, {username}</h1>
                        <img src={logo} className="App-logo" alt="logo" />
                        <AuthBtn
                            onClick={() => this.handleScrape()}>
                            Scrape
                        </AuthBtn>
                    </header>
                </div>
            </div>
        );
    }
}

export default Main;