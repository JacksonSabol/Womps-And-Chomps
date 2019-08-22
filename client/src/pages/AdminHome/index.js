import React, { Component } from 'react';
import { AuthBtn } from '../../Components/Button';
import logo from '../../logo.svg';
import axios from 'axios';
import '../../App.css';

class AdminHome extends Component {
    state = {
        username: this.props.username,
        scrapeComplete: false,
        reformatComplete: false
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

    handleReformat = () => {
        axios
            .get('/api/events/reformat')
            .then(response => {
                console.log(response);
                this.setState({ reformatComplete: true });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { scrapeComplete, reformatComplete } = this.state;
        return (
            <div>
                <div className="App">
                    <header className="App-header">
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
                        <AuthBtn
                            onClick={() => this.handleReformat()}>
                            Reformat
                        </AuthBtn>
                        {reformatComplete && (
                            <div className="auth-alert">
                                <p className="form-alert">Reformat complete</p>
                            </div>
                        )}
                    </header>
                </div>
            </div>
        );
    }
}

export default AdminHome;