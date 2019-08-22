import React, { Component } from 'react';
import axios from 'axios';
import './index.css';
import { Instructotron } from '../../Components/Instructotron';
import { EventCard } from '../../Components/EventCard';
import bgThr from '../../media/slider/3.jpg';

class Favorites extends Component {
    // Set the initial state values
    state = {
        username: '',
        favorites: [],
        loading: true,
        loginError: false
    };

    handleUnsaveEvent = eventId => {
        axios
            .put(`/api/events/unsave/${eventId}`)
            .then(response => {
                const eventData = this.addBgImages(response.data);
                this.setState({ favorites: eventData });
            })
            .catch(error => console.log(error));
    };

    addBgImages = (events) => {
        const reformatted = events.map((event) => {
            if (event.imgSrc === "N/A" || event.imgSrc === "video") {
                event.imgSrc = bgThr;
            }
            return event;
        });
        return reformatted;
    };

    async componentDidMount() {
        await axios
            .get('/api/events/saved')
            .then(response => {
                const eventData = this.addBgImages(response.data);
                this.setState({
                    loading: false,
                    username: this.props.username,
                    favorites: eventData
                });
            })
            .catch(error => {
                console.log(error.message);
                this.setState({
                    loading: false,
                    loginError: true
                });
            });
    }

    render() {
        const { favorites, loading, loginError } = this.state;
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
                            <h1>Saved Events:</h1>
                            {favorites.length ? (
                                <section className="event-area">
                                    <h5>Events In Northern California:</h5>
                                    {favorites.map(event => (
                                        <EventCard key={event._id}
                                            eventId={event._id}
                                            link={event.link}
                                            title={event.title}
                                            dateAndTime={event.dateAndTime}
                                            priceAndAges={event.priceAndAges}
                                            fullTitle={event.fullTitle}
                                            organizers={event.organizers}
                                            bgImg={event.imgSrc}
                                            favorite={true}
                                            alt={`No Image Available`}
                                            handleUnsaveEvent={this.handleUnsaveEvent}
                                        />
                                    ))}
                                </section>
                            ) : (
                                    <h3>No Results to Display. Visit the Events page to view upcoming events.</h3>
                                )}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Favorites;