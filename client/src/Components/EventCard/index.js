import React from "react";
import "./index.css";

// This Card component allows us to use a styled card for events with less syntax
export function EventCard(props) {
    return (
        <div className="event-card-container">
            <div className="single-event">
                <div className="card-bg" style={{ backgroundImage: `url("${props.bgImg}")` }}></div>
                <div className="event-details">
                    <div className="event-meta">
                        <span>{props.dateAndTime} | {props.priceAndAges}</span>
                    </div>
                    <h5><strong><a href={props.link} rel="noopener noreferrer" target="_blank">{props.title}</a></strong></h5>
                    <p>{props.fullTitle} | {props.organizers}</p>
                </div>
            </div>
        </div>
    );
}