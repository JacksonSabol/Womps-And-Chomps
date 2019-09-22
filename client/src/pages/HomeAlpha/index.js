import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import './index.css';
import { Instructotron } from '../../Components/Instructotron';
import Slider from '../../Components/Slider';
// import { EventCard } from '../../Components/EventCard';
import bgThr from '../../media/slider/3.jpg';

const today = moment().endOf('day');
const tomorrow = moment(today).add(1, 'day');
const week = moment().endOf('week').add(1, 'day');

class HomeAlpha extends Component {
    // Set the initial state values
    state = {
        username: '',
        events: [],
        favorites: [],
        featured: [],
        saved: [],
        loading: true,
        loginError: false
    };

    offset = (elm) => {
        const rect = elm.getBoundingClientRect(),
            currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return rect.top + currentScrollTop;
    };

    handlePageScroll = (hash) => {
        let element = document.getElementById(hash);
        let target = this.offset(element);
        window.scroll({
            top: target - 70,
            left: 0,
            behavior: 'smooth'
        });
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
                const favoritedEvent = this.state.events.filter(event => event._id === response.data);
                // console.log("Event Data: ", eventData);
                // console.log("Favorited event: ", favoritedEvent);
                this.setState({
                    events: eventData,
                    favorites: [...this.state.favorites, ...favoritedEvent],
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
                const savedIds = response.data.saved.map(event => event._id);
                const eventData = response.data.events.map(event => {
                    if (event.imgSrc === "N/A" || event.imgSrc === "video" || event.imgSrc === "Rate Limiter: Slow Down" || !event.imgSrc) {
                        event.imgSrc = bgThr;
                    }
                    if (savedIds.indexOf(event._id) > -1) {
                        event.saved = true;
                    } else {
                        event.saved = false;
                    }
                    event.venue = event.fullTitle.split('@')[1].trim();
                    return event;
                });
                // console.log(eventData);
                const favoriteEvents = response.data.saved.map(event =>{
                    if (event.imgSrc === "N/A" || event.imgSrc === "video" || event.imgSrc === "Rate Limiter: Slow Down" || !event.imgSrc) {
                        event.imgSrc = bgThr;
                    }
                    event.saved = true;
                    event.venue = event.fullTitle.split('@')[1].trim();
                    return event;
                });
                // console.log(favoriteEvents);
                this.setState({
                    loading: false,
                    username: this.props.username,
                    events: eventData,
                    favorites: favoriteEvents,
                    saved: savedIds
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
        const { events, favorites, loading, loginError } = this.state;
        const todays = events.filter(event => {
            const normDate = moment(event.sortDate);
            return today.diff(normDate, 'minutes') > 0;
        });
        const tomorrows = events.filter(event => {
            const normDate = moment(event.sortDate);
            const diff = tomorrow.diff(normDate, 'minutes'); 
            return diff > 0 && diff < 1440;
        });
        const thisWeeks = events.filter(event => {
            const normDate = moment(event.sortDate);
            const diff = week.diff(normDate, 'minutes'); 
            return diff > 0;
        });
        const houseEvents = events.filter(event => event.genres.indexOf("house") > -1);
        const technoEvents = events.filter(event => event.genres.indexOf("techno") > -1);
        const dubstepEvents = events.filter(event => event.genres.indexOf("dubstep") > -1);
        const tranceEvents = events.filter(event => event.genres.indexOf("trance") > -1);
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
                    <div className="home-alpha-wrapper">
                        <div className="home-alpha-section">
                            <h1>Home (Alpha):</h1>
                            <Slider
                                events={[...favorites].reverse()}
                                sliderTitle={"Favorites: "}
                                keySuffix={"fav"}
                                handleSaveEvent={this.handleSaveEvent}
                                handlePageScroll={this.handlePageScroll}
                            />
                            <Slider
                                events={todays}
                                sliderTitle={"Today's Events: "}
                                keySuffix={"tod"}
                                handleSaveEvent={this.handleSaveEvent}
                                handlePageScroll={this.handlePageScroll}
                            />
                            <Slider
                                events={tomorrows}
                                sliderTitle={"Tomorrow's Events: "}
                                keySuffix={"tom"}
                                handleSaveEvent={this.handleSaveEvent}
                                handlePageScroll={this.handlePageScroll}
                            />
                            <Slider
                                events={thisWeeks}
                                sliderTitle={"This Week's Events: "}
                                keySuffix={"wee"}
                                handleSaveEvent={this.handleSaveEvent}
                                handlePageScroll={this.handlePageScroll}
                            />
                            <Slider
                                events={houseEvents}
                                sliderTitle={"House: "}
                                keySuffix={"hou"}
                                handleSaveEvent={this.handleSaveEvent}
                                handlePageScroll={this.handlePageScroll}
                            />
                            <Slider
                                events={technoEvents}
                                sliderTitle={"Techno: "}
                                keySuffix={"tno"}
                                handleSaveEvent={this.handleSaveEvent}
                                handlePageScroll={this.handlePageScroll}
                            />
                            <Slider
                                events={dubstepEvents}
                                sliderTitle={"Dubstep: "}
                                keySuffix={"dst"}
                                handleSaveEvent={this.handleSaveEvent}
                                handlePageScroll={this.handlePageScroll}
                            />
                            <Slider
                                events={tranceEvents}
                                sliderTitle={"Trance: "}
                                keySuffix={"tra"}
                                handleSaveEvent={this.handleSaveEvent}
                                handlePageScroll={this.handlePageScroll}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default HomeAlpha;