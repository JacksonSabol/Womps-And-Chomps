import React, { Component } from 'react';
import { AuthBtn } from '../../Components/Button';
import logo from '../../logo.svg';
import axios from 'axios';
import '../../App.css';

class Main extends Component {
    // Set the initial state values
    state = {
        username: this.props.username,
        scrapeComplete: false
    };

    handleScrape = () => {
        axios
            .get('/api/events/scrape')
            .then(response => {
                this.setState({ scrapeComplete: true });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { scrapeComplete } = this.state;
        return (
            <div>
                <div className="App">
                    <header className="App-header">
                        {/* <h1>Welcome, {username}</h1> */}
                        <img src={logo} className="App-logo" alt="logo" />
                        <AuthBtn
                            onClick={() => this.handleScrape()}>
                            Scrape
                        </AuthBtn>
                        {scrapeComplete && (
                            <div className="auth-alert">
                                <p className="form-alert">Scrape complete! Visit the Events page to see the most recent events added.</p>
                            </div>
                        )}
                    </header>
                </div>
            </div>
        );
    }
}

export default Main;