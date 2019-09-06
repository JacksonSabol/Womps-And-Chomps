import React, { Component } from 'react';
import { AuthBtn } from '../../Components/Button';
import logo from '../../logo.svg';
import axios from 'axios';
import '../../App.css';

class AdminHome extends Component {
    state = {
        username: this.props.username,
        scrapeComplete: false,
        reformatComplete: false,
        reformatEntries: [],
        reformatErrors: [],
        reformatRaComplete: false,
        reformatRaEntries: [],
        reformatRaErrors: [],
        resWriting: false,
        resWritingEntries: [],
        resWritingErrors: []
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
                const numEntries = response.data.split('').filter(letter => letter === "a");
                const numErrors = response.data.split('').filter(letter => letter === "e");
                this.setState({ reformatComplete: true, reformatEntries: numEntries, reformatErrors: numErrors });
            })
            .catch(error => {
                console.log(error);
            });
    };
    handleReformatRa = () => {
        axios
            .get('/api/events/reformat/ra')
            .then(response => {
                console.log(response);
                const numEntries = response.data.split('').filter(letter => letter === "a");
                const numErrors = response.data.split('').filter(letter => letter === "e");
                this.setState({ reformatRaComplete: true, reformatRaEntries: numEntries, reformatRaErrors: numErrors });
            })
            .catch(error => {
                console.log(error);
            });
    };
    handleResWriting = () => {
        axios
            .get('/api/events/test/res')
            .then(response => {
                console.log(response);
                const numEntries = response.data.split('').filter(letter => letter === "a");
                const numErrors = response.data.split('').filter(letter => letter === "e");
                this.setState({ resWriting: true, resWritingEntries: numEntries, resWritingErrors: numErrors });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { scrapeComplete, reformatComplete, reformatEntries, reformatErrors, reformatRaComplete, reformatRaEntries, reformatRaErrors, resWriting, resWritingEntries, resWritingErrors } = this.state;
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
                                <p className="form-alert">Reformat complete. Entries modified: {reformatEntries.length}. Errors: {reformatErrors.length}</p>
                            </div>
                        )}
                        <AuthBtn
                            onClick={() => this.handleReformatRa()}>
                            Reformat Resident Advisor
                        </AuthBtn>
                        {reformatRaComplete && (
                            <div className="auth-alert">
                                <p className="form-alert">Reformat complete. Entries modified: {reformatRaEntries.length}. Errors: {reformatRaErrors.length}</p>
                            </div>
                        )}
                        <AuthBtn
                            onClick={() => this.handleResWriting()}>
                            Res Writing Test
                        </AuthBtn>
                        {resWriting && (
                            <div className="auth-alert">
                                <p className="form-alert">Res test complete. Entries modified: {resWritingEntries.length}. Errors: {resWritingErrors.length}</p>
                            </div>
                        )}
                    </header>
                </div>
            </div>
        );
    }
}

export default AdminHome;