import React, { useEffect, useRef, useState } from 'react';

import './EmbedDesctopSliderElement.css';

const EmbedDesctopSliderElement = ({ galleryData, imageIndex }) => {
  const [imageOne, setImageOne] = useState({
    visible: true,
    image: galleryData.images[imageIndex],
  });

  const [imageTwo, setImageTwo] = useState({
    visible: false,
    image: null,
  });

  const imageOneVisibleRef = useRef(true);

  useEffect(() => {
    const newImage = galleryData.images[imageIndex];

    if (imageOneVisibleRef.current) {
      setImageTwo((prev) => ({
        ...prev,
        image: newImage,
        visible: true,
      }));

      setImageOne((prev) => ({ ...prev, visible: false }));
      imageOneVisibleRef.current = false;
    } else {
      setImageOne((prev) => ({
        ...prev,
        image: newImage,
        visible: true,
      }));
      setImageTwo((prev) => ({ ...prev, visible: false }));
      imageOneVisibleRef.current = true;
    }
  }, [galleryData, imageIndex]);

  return (
    <div className="embed-desctop-slider-wrapper">
      {imageOne.image && (
        <img
          className={`embed-desctop-slider-image ${
            imageOne.visible ? 'embed-desctop-slider-image-visible' : ''
          }`}
          src={'https://liebevollbelichtet.de/' + imageOne.image.path}
        />
      )}
      {imageTwo.image && (
        <img
          className={`embed-desctop-slider-image ${
            imageTwo.visible ? 'embed-desctop-slider-image-visible' : ''
          }`}
          src={'https://liebevollbelichtet.de/' + imageTwo.image.path}
        />
      )}
    </div>
  );
};

export default EmbedDesctopSliderElement;
