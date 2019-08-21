import React from "react";
import "./index.css";

// Heart Icon: https://www.flaticon.com/authors/freepik" licensed by CC 3.0
// https://css-tricks.com/glitch-effect-text-images-svg/
export function EventCard(props) {
    return (
        <div className="event-card-container">
            <div className="single-event">
                {props.favorite ? (
                    <button className="unsave-btn" onClick={() => props.handleUnsaveEvent(props.eventId)}>
                        <div className="unsave-ex"></div>
                        <span className="tooltiptext">Remove Event</span>
                    </button>
                ) : (
                        <button className="save-btn" onClick={() => props.handleSaveEvent(props.eventId)} disabled={props.saved}>
                            <div className={`save-heart${props.saved}`}></div>
                            <span className="tooltiptext">Save Event</span>
                        </button>
                    )}
                <div className="card-bg" style={{ backgroundImage: `url("${props.bgImg}")` }}></div>
                <div className="event-details">
                    {/* <div className="event-meta">
                        <span>{props.dateAndTime} | {props.priceAndAges}</span>
                    </div> */}
                    {/* <p>{props.fullTitle} | {props.organizers}</p> */}
                    <h5><a href={props.link} rel="noopener noreferrer" target="_blank">{props.title}</a></h5>
                </div>
            </div>
        </div>
    );
}