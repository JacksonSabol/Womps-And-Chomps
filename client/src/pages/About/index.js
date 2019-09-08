import React, { Component } from 'react';
import logo from '../../logo.svg';
import axios from 'axios';
import '../../App.css';
import './index.css';
import { List, ListItem } from '../../Components/List';

class About extends Component {
    // Set the initial state values
    state = {
        username: this.props.username,
        commitData: []
    };

    handleCommits = () => {
        axios
            .get('https://api.github.com/repos/JacksonSabol/Womps-And-Chomps/commits')
            .then(response => {
                const commits = response.data.map((commitObj) => {
                    const commitReformatted = {
                        message: commitObj.commit.message,
                        date: commitObj.commit.author.date
                    };
                    return commitReformatted
                });
                this.setState({ commitData: commits });
            })
            .catch(error => {
                console.log(error);

            });
    };

    componentDidMount() {
        this.handleCommits();
    };

    render() {
        const { username, commitData } = this.state;
        return (
            <div>
                <header className="home-header">
                    <h3>Welcome, {username}!</h3>
                    <img src={logo} className="react-logo" alt="logo" />
                    <section className="app-description">
                        <p>Womps &amp; Chomps is currently in its early stages of development. Feel free to navigate around using the menu at the top of the page, and follow along with the development process by checking out the Change Log below.</p>
                        <p>All events listed are real events and will link to their respective event pages when clicked.</p>
                        <p>* The events displayed here are scraped from <a href="https://19hz.info/eventlisting_BayArea.php" target="_blank" rel="noopener noreferrer">https://19hz.info/</a>. Learn more about <a href="https://en.wikipedia.org/wiki/Web_scraping" target="_blank" rel="noopener noreferrer">web scraping here</a>.</p>
                    </section>
                    <div className="events-wrapper">
                        <div className="events-section">
                        <h5>Change Log:</h5>
                            {commitData.length ? (
                                <List>
                                    {commitData.map((commit, index) => (
                                        <ListItem key={index}>
                                            <strong>{commit.date}</strong> - {commit.message}
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                    <h3>Error Retrieving Commits: No Results to Display.</h3>
                                )}
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default About;