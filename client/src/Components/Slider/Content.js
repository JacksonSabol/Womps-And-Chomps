import React from 'react';
import IconCross from './Icons/IconCross';
import './Content.css';

const Content = ({ event, onClose, handleSaveEvent, animate }) => (
  <div className={`content${animate}`}>
    <div className="content__background">
      <div className="content__background__shadow" />
      <div
        className="content__background__image"
        style={{ backgroundImage: `url(${event.imgSrc})` }}
      />
    </div>
    <div className="content__area">
      <button className="slider-save-btn" onClick={() => handleSaveEvent(event._id)} disabled={event.saved}>
        <div className={`slider-save-heart${event.saved ? " saved" : ""}`}></div>
      </button>
      <div className="content__area__container">
        <div className="content__title">{event.title}</div>
        <div className="content__description">
          <p>When: {event.dateAndTime}</p>
          <p>Where: {event.venue}</p>
          <p>Price | Ages: {event.priceAndAges}</p>
          <p>Organizers: {event.organizers || "N/A"}</p>
          <p>Link: <a href={`${event.link}`} rel="noopener noreferrer" target="_blank">{event.link}</a></p>
        </div>
      </div>
      <button className="content__close" onClick={onClose}>
        <IconCross />
      </button>
    </div>
  </div>
);

export default Content;
