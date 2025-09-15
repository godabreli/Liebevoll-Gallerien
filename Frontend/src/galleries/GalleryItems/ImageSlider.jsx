import React, { useState, useContext, useMemo } from 'react';
import { motion } from 'motion/react';
import { AuthContext } from '../../../context/auth-context';

import { API_URL } from '../../util/globalURLS';

import './ImageSlider.css';
import MobileSliderElement from './MobileSliderElement';
import DesctopSliderElement from './DesctopSliderElement';
import DownloadButtonSVG from '../../SVG/DownloadButtonSVG';
import XButtonSVG from '../../SVG/XButtonSVG';

const ImageSlider = (props) => {
  const { galleryData, imageIndex } = props;
  const auth = useContext(AuthContext);

  const [index, setIndex] = useState(imageIndex);

  const downloadAuth = useMemo(() => {
    if (auth.userToken) {
      return auth.userToken;
    } else {
      return auth.galleryToken;
    }
  }, [auth.galleryToken, auth.userToken]);

  const authType = useMemo(() => {
    if (auth.userToken) {
      return 'user';
    } else {
      return 'gallery';
    }
  }, [auth.userToken]);

  const toTheRight = () => {
    setIndex((prev) => (prev === galleryData.images.length - 1 ? 0 : prev + 1));
  };

  const toTheLeft = () => {
    setIndex((prev) => (prev === 0 ? galleryData.images.length - 1 : prev - 1));
    //////////////////////////////////////////////////
  };

  const imageDownloadHandler = async () => {
    const imagePath = `uploads/galleries/${galleryData.name}/${galleryData.images[index].name}`;

    try {
      const response = await fetch(
        `${API_URL}api/galleries/downloads/download-one-image`,
        {
          method: 'POST',
          body: JSON.stringify({
            imagePath,
            galleryId: galleryData.Id,
            authType,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${downloadAuth}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Download fehlgeschlagen: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = galleryData.images[index].name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  };

  return (
    <motion.div
      initial={window.innerWidth > 768 ? { opacity: 0 } : { y: 1000 }}
      animate={
        window.innerWidth > 768
          ? { opacity: 1, transition: { duration: 1 } }
          : { y: 0, transition: { duration: 0.3 } }
      }
      exit={
        window.innerWidth > 768
          ? { opacity: 0, transition: { duration: 1 } }
          : { y: 1000, transition: { duration: 0.3 } }
      }
      className="imageSlider"
    >
      {window.innerWidth < 768 ? (
        <MobileSliderElement
          toTheLeft={toTheLeft}
          toTheRight={toTheRight}
          galleryData={galleryData}
          imageIndex={index}
        />
      ) : (
        <DesctopSliderElement galleryData={galleryData} imageIndex={index} />
      )}
      <div className="counter-div">{`${index + 1} / ${
        galleryData.images.length
      }`}</div>

      {galleryData.downloadFunction && (
        <div
          className="downloadButton"
          onClick={() => {
            if (navigator.vibrate) {
              navigator.vibrate(50); // 50ms Vibration
            }
            imageDownloadHandler();
          }}
        >
          <DownloadButtonSVG />
        </div>
      )}

      <div
        className="closeSliderButton"
        onClick={() => props.closeSlider(index)}
      >
        <XButtonSVG />
      </div>
      <div className="errow-div errow-div-left" onClick={toTheLeft}>
        <div className="errow">&#65513;</div>
      </div>
      <div className="errow-div errow-div-right" onClick={toTheRight}>
        <div className="errow">&#65515;</div>
      </div>
    </motion.div>
  );
};

export default ImageSlider;
