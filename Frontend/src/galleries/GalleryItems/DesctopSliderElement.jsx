import React, { useEffect, useRef, useState } from 'react';

import './DesctopSliderElement.css';

import { API_URL } from '../../util/globalURLS';

const DesctopSliderElement = ({ galleryData, imageIndex }) => {
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
    <div className="desctop-slider-wrapper">
      {imageOne.image && (
        <img
          className={`desctop-slider-image ${
            imageOne.visible ? 'desctop-slider-image-visible' : ''
          }`}
          src={API_URL + imageOne.image.path}
        />
      )}
      {imageTwo.image && (
        <img
          className={`desctop-slider-image ${
            imageTwo.visible ? 'desctop-slider-image-visible' : ''
          }`}
          src={API_URL + imageTwo.image.path}
        />
      )}
    </div>
  );
};

export default DesctopSliderElement;
