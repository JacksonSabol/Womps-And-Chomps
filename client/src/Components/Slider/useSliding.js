import { useState, useEffect } from 'react'

const useSliding = (containerWidth, countElements) => {
  const [distance, setDistance] = useState(0);
  const [totalInViewport, setTotalInViewport] = useState(0)
  const [viewed, setViewed] = useState(0);

  const calcCardWidth = () => {
    if ((containerWidth / 0.97) > 1400) { return parseInt(containerWidth / 5) }
    else if ((containerWidth / 0.97) <= 1400 && containerWidth > 1199) { return parseInt(containerWidth / 4) }
    else if ((containerWidth / 0.97) <= 1199 && containerWidth > 992) { return parseInt(containerWidth / 3) }
    else if ((containerWidth / 0.97) <= 992 && containerWidth > 768) { return parseInt(containerWidth / 2) }
    else { return parseInt(containerWidth) };
  };

  const [cardwidth, setCardWidth] = useState(calcCardWidth());

  useEffect(() => {
    const cardWidthCalcd = calcCardWidth();
    setCardWidth(cardWidthCalcd);
    setTotalInViewport(Math.round(containerWidth / cardwidth));
  }, [containerWidth]);

  const handlePrev = () => {
    setViewed(viewed - totalInViewport);
    setDistance(distance + containerWidth);
  }

  const handleNext = () => {
    setViewed(viewed + totalInViewport);
    setDistance(distance - containerWidth);
  }

  const slideProps = {
    style: { transform: `translate3d(${distance}px, 0, 0)` }
  };

  const hasPrev = distance < 0;
  const hasNext = (viewed + totalInViewport) < countElements;

  return { handlePrev, handleNext, slideProps, hasPrev, hasNext };
}

export default useSliding;