import React from 'react';
import ShowDetailsButton from './ShowDetailsButton'
import './Item.css'

const Item = (props) => {
  const isActive = props.currentSlide && props.currentSlide._id === props.event._id ? " item--open" : "";

  return (
    <div className={`item${isActive}`}>
      <img src={props.event.imgSrc} alt="" />
      <div className="title-container">
        <p>{props.event.title}</p>
      </div>
      <ShowDetailsButton onClick={() => props.handleSelect(props.event, props.sliderId)} />
    </div>
  );
};

export default Item;
