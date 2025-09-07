import React, { useEffect, useState } from 'react';

import './Diashow.css';

export const Diashow = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  });

  return (
    <div className="diashow-wrapper">
      {images.map((image, i) => (
        <img
          className={`diashow-image diashow-image-${
            i === index ? 'visible' : ''
          }`}
          key={i}
          src={image}
          alt="Diashow image"
        />
      ))}
    </div>
  );
};
