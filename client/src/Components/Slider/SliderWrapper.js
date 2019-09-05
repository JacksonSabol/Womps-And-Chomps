import React from 'react'
import './SliderWrapper.css'
const SliderWrapper = (props) => (
  <div className="slider-wrapper" style={{ width: `${props.width}px` }}>
    <div className="slider-title">
      {props.title}
    </div>
    {props.children}
  </div>
);

export default SliderWrapper;
