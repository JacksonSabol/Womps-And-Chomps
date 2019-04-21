import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthBtn } from '../../components/Button';
import axios from 'axios';
import './index.css';
import { Instructotron } from '../../components/Instructotron';
import { List, ListItem } from '../../components/List';

class Events extends Component {
    // Set the initial state values
    state = {
        username: '',
        events: [],
        loading: true,
        loggedIn: false,
        loginError: false
    };

    async componentDidMount() {
        await axios
            .get('/api/events/all')
            .then(response => {
                console.log(response);
                this.setState({
                    loading: false,
                    loggedIn: true,
                    username: this.props.username,
                    events: response.data
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loading: false,
                    loginError: true
                });
            });
    }

    handleLogout = () => {
        axios
            .post('/user/logout')
            .then(response => {
                if (response.status === 204) {
                    this.setState({ loggedIn: false });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { username, events, loading, loggedIn } = this.state;
        if (loading) {
            return (
                <Instructotron>
                    <h1>Loading...</h1>
                </Instructotron>
            );
        }
        else if (!loggedIn) {
            return <Redirect to="/user/signin" />;
        } else {
            return (
                <div className="events-wrapper">
                    <h1>Welcome, {username}</h1>
                    <a href={`/user/profile/${username}`}>Home</a>
                    <AuthBtn onClick={this.handleLogout}>Logout</AuthBtn>
                    <div className="events-section">
                        {events.length ? (
                            <List>
                                <h5>Upcoming Events:</h5>
                                {events.map(event => (
                                    <ListItem key={event._id}>
                                        <a href={event.link} target="_blank" rel="noopener noreferrer">
                                            <strong>{event.title}</strong> - {event.dateAndTime}
                                        </a>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                                <h3>No Results to Display. Click on the Scrape Button to Populate the Database.</h3>
                            )}
                    </div>
                </div>
            );
        }
    }
}

export default Events;