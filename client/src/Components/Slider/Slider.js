import React, { useState } from 'react';
import Item from './Item';
import Content from './Content';
import SlideButton from './SlideButton';
import SliderWrapper from './SliderWrapper';
import useContainerSize from './useContainerSize';
import useSliding from './useSliding';
import './Slider.css';

const Slider = (props) => {
  const [currentSlide, setCurrentSlide] = useState(null);
  const [contentStyle, setContentStyle] = useState("");
  const { containerWidth } = useContainerSize();
  const {
    handlePrev,
    handleNext,
    slideProps,
    hasNext,
    hasPrev
  } = useSliding(containerWidth, props.events.length);

  const handleSelect = (event, slider) => {
    setTimeout(() => props.handlePageScroll(slider), 500);
    setCurrentSlide(event);
    setTimeout(() => {
      setContentStyle(" animate");
    }, 100);
  };

  const handleClose = () => {
    setCurrentSlide(null);
    setContentStyle("");
  };

  const isOpen = currentSlide !== null ? " slider--open" : "";
  const sliderId = `${props.keySuffix}-slider`;

  return (
    <div>
      <SliderWrapper width={containerWidth} title={props.sliderTitle} sliderId={sliderId}>
        <div
          className={`slider${isOpen}`}
        >
          <div className="slider__container" {...slideProps}>
            {props.events.map(event => (
              <Item
                event={event}
                key={event._id + props.keySuffix}
                sliderId={sliderId}
                handleSelect={handleSelect}
                currentSlide={currentSlide}
              />
            ))}
          </div>
        </div>
        {hasPrev && !isOpen && <SlideButton onClick={handlePrev} type="prev" />}
        {hasNext && !isOpen && <SlideButton onClick={handleNext} type="next" />}
        {isOpen && hasPrev && <SlideButton onClick={handlePrev} type="prev-open" />}
        {isOpen && hasNext && <SlideButton onClick={handleNext} type="next-open" />}
      </SliderWrapper>
      {currentSlide && <Content event={currentSlide} onClose={handleClose} animate={contentStyle} />}
    </div>
  );
};

export default Slider;
