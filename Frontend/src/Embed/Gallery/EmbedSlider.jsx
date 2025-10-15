import React, { useState, useContext } from 'react';
import { motion } from 'motion/react';

import EmbedDesctopSliderElement from './EmbedDesctopSliderElement';
import EmbedMobileSliderElement from './EmbedMobileSliderElement';

import XButtonSVG from '../../SVG/XButtonSVG';
import DownloadButton02 from '../../SVG/Downloadbutton02';
import { DownloadsContext } from './downloads-context';

const EmbedSlider = (props) => {
  const { galleryData, imageIndex } = props;

  const downloadVars = useContext(DownloadsContext);

  const [index, setIndex] = useState(imageIndex);

  const toTheRight = () => {
    setIndex((prev) => (prev === galleryData.images.length - 1 ? 0 : prev + 1));
  };

  const toTheLeft = () => {
    setIndex((prev) => (prev === 0 ? galleryData.images.length - 1 : prev - 1));
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
        <EmbedMobileSliderElement
          toTheLeft={toTheLeft}
          toTheRight={toTheRight}
          galleryData={galleryData}
          imageIndex={index}
        />
      ) : (
        <EmbedDesctopSliderElement
          galleryData={galleryData}
          imageIndex={index}
        />
      )}
      <div className="counter-div">{`${index + 1} / ${
        galleryData.images.length
      }`}</div>
      <div
        className="downloadButton"
        onClick={() => downloadVars.oneImageDownloadHandler(index)}
      >
        <DownloadButton02 color="rgba(255, 255, 255, 0.586)" strokeWidth="11" />
      </div>

      <div
        className="closeSliderButton"
        onClick={() => props.closeSlider(index)}
      >
        <XButtonSVG color="rgba(255, 255, 255, 0.586)" />
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

export default EmbedSlider;
