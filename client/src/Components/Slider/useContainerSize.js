import { useState, useEffect } from 'react';

const useContainerSize = () => {
  const [containerWidth, setContainerWidth] = useState(parseInt(window.innerWidth * 0.97));

  const updateWidth = () => {
    setContainerWidth(parseInt(window.innerWidth * 0.97));
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  });

  return { containerWidth };
}

export default useContainerSize;