import React from "react";
import "./index.css";

// This Card component allows us to use a styled card for events with less syntax
export function EventCard(props) {
    return (
        <div className="event-card-container">
            <div className="single-event">
                <button className="save-btn" onClick={() => props.handleSaveEvent(props.eventId)}>
                    + <span className="tooltiptext">Save Event</span>
                </button>
                {/* <div className="card-bg-wrapper"> */}
                <div className="card-bg" style={{ backgroundImage: `url("${props.bgImg}")` }}></div>
                {/* </div> */}
                <div className="event-details">
                    {/* <div className="event-meta">
                        <span>{props.dateAndTime} | {props.priceAndAges}</span>
                    </div> */}
                    {/* <p>{props.fullTitle} | {props.organizers}</p> */}
                    <h5><strong><a href={props.link} rel="noopener noreferrer" target="_blank">{props.title}</a></strong></h5>
                </div>
            </div>
        </div>
    );
}