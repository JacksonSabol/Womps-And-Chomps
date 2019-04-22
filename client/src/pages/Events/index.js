import React, { Component } from 'react';
import axios from 'axios';
import './index.css';
import { Instructotron } from '../../Components/Instructotron';
import { List, ListItem } from '../../Components/List';

class Events extends Component {
    // Set the initial state values
    state = {
        username: '',
        events: [],
        loading: true,
        loginError: false
    };

    async componentDidMount() {
        await axios
            .get('/api/events/all')
            .then(response => {
                console.log(response);
                this.setState({
                    loading: false,
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

    render() {
        const { events, loading, loginError } = this.state;
        if (loading) {
            return (
                <Instructotron>
                    <h1>Loading...</h1>
                </Instructotron>
            );
        }
        else if (loginError) {
            return <a href="/"><h4>Error occurred: please log in again.</h4></a>;
        } else {
            return (
                <div>
                    <div className="events-wrapper">
                        <div className="events-section">
                            <h1>Upcoming Events:</h1>
                            {events.length ? (
                                <List>
                                    <h5>Events In Northern California:</h5>
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
                </div>
            );
        }
    }
}

export default Events;