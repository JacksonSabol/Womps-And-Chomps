import React, { Component } from 'react';
import axios from 'axios';
import './index.css';
import { Instructotron } from '../../Components/Instructotron';
import { EventCard } from '../../Components/EventCard';
// import bgOne from '../../media/slider/1.jpg';
// import bgTwo from '../../media/slider/2.jpg';
import bgThr from '../../media/slider/3.jpg';
// import bgFou from '../../media/slider/4.jpg';
// import bgFiv from '../../media/slider/5.jpg';
// import bgSix from '../../media/slider/6.jpg';
// import bgSev from '../../media/slider/7.jpg';
// import bgEig from '../../media/slider/8.jpg';
// import bgNin from '../../media/slider/9.jpg';
// import bgTen from '../../media/slider/10.jpg';
// import eventBG from '../../media/eventBG.jpg';

class Events extends Component {
    // Set the initial state values
    state = {
        username: '',
        events: [],
        saved: [],
        loading: true,
        loginError: false
    };

    handleSaveEvent = eventId => {
        axios
            .put(`/api/events/save/${eventId}`)
            .then(response => {
                // Add alert here as well

                const eventData = this.state.events.map((event) => {
                    if (event._id === response.data) {
                        event.saved = true;
                    }
                    return event;
                });
                this.setState({
                    events: eventData,
                    saved: [...this.state.saved, response.data]
                });
            })
            .catch(error => console.log(error));
    };

    async componentDidMount() {
        await axios
            .get('/api/events/all')
            .then(response => {
                // console.log(response.data);
                const eventData = response.data.events.map((event) => {
                    if (event.imgSrc === "N/A" || event.imgSrc === "video") {
                        event.imgSrc = bgThr;
                    }
                    if (response.data.saved.indexOf(event._id) > -1) {
                        event.saved = true;
                    } else {
                        event.saved = false;
                    }
                    return event;
                });
                // console.log(eventData);
                this.setState({
                    loading: false,
                    username: this.props.username,
                    events: eventData,
                    saved: response.data.saved
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
                                <section className="event-area">
                                    <h5>Events In Northern California:</h5>
                                    {events.map(event => (
                                        <EventCard key={event._id}
                                            eventId={event._id}
                                            link={event.link}
                                            title={event.title}
                                            dateAndTime={event.dateAndTime}
                                            priceAndAges={event.priceAndAges}
                                            fullTitle={event.fullTitle}
                                            organizers={event.organizers}
                                            bgImg={event.imgSrc}
                                            favorite={false}
                                            saved={event.saved ? " saved" : ""}
                                            alt={`No Image Available`}
                                            handleSaveEvent={this.handleSaveEvent}
                                        />
                                    ))}
                                </section>
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