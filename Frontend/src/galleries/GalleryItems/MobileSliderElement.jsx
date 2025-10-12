import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet';

import './MobileSliderElement.css';
import { useCallback } from 'react';

import { API_URL } from '../../util/globalURLS';

const SWIPE_THRESHOLD = 160;
const DRAG_SENSITIVITY = 15;

const MobileSliderElement = (props) => {
  const { galleryData, imageIndex, toTheLeft, toTheRight } = props;
  const [windowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const sliderRef = useRef();
  const imageWrapperRef = useRef();
  const lastMoveXPositionRef = useRef(0);
  const accumulateDeltaRef = useRef(0);
  const hasSwipedRef = useRef(false);
  const handleTouchMoveRef = useRef();
  const pinchingStartDistanceRef = useRef();
  const currentScaleRef = useRef();
  const isPinchingRef = useRef(false);
  const pinchLastXPositionRef = useRef(0);
  const pinchLastYPositionRef = useRef(0);
  const pinchAccumulateDeltaX = useRef(0);
  const pinchAccumulateDeltaY = useRef(0);
  const lastMoveOneFingerXPositionRef = useRef(0);
  const lastMoveOneFingerYPositionRef = useRef(0);
  const oneFingerMoveRef = useRef(false);

  const calcImageStyle = (index) => {
    let imageHight;
    let imageWidth;

    if (windowSize.width > windowSize.height) {
      imageHight = windowSize.height * 0.97;
      imageWidth =
        galleryData.images[index].height > galleryData.images[index].width
          ? imageHight /
            (galleryData.images[index].height / galleryData.images[index].width)
          : imageHight *
            (galleryData.images[index].width /
              galleryData.images[index].height);
    } else {
      imageWidth = windowSize.width * 0.98;
      imageHight =
        galleryData.images[index].height > galleryData.images[index].width
          ? imageWidth *
            (galleryData.images[index].height / galleryData.images[index].width)
          : imageWidth /
            (galleryData.images[index].width /
              galleryData.images[index].height);
    }
    return { height: imageHight, width: imageWidth };
  };

  const currentImageStyle = calcImageStyle(imageIndex);

  const prevImageStyle = calcImageStyle(
    imageIndex === 0 ? galleryData.images.length - 1 : imageIndex - 1
  );

  const nextImageStyle = calcImageStyle(
    imageIndex === galleryData.images.length - 1 ? 0 : imageIndex + 1
  );

  //////////////////////////////////////////////////////////////

  const getDistance = useCallback((touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getMidpoint = useCallback((touch1, touch2) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }, []);

  /////////////////////////////////////////////////////////////////

  const handleTouchStart = useCallback(
    (e) => {
      if (e.touches.length === 1) {
        lastMoveXPositionRef.current = e.touches[0].clientX;

        hasSwipedRef.current = false;
      }

      if (e.touches.length === 2 && !oneFingerMoveRef.current) {
        pinchingStartDistanceRef.current = getDistance(
          e.touches[0],
          e.touches[1]
        );

        const midPoint = getMidpoint(e.touches[0], e.touches[1]);

        pinchLastXPositionRef.current = midPoint.x;
        pinchLastYPositionRef.current = midPoint.y;

        if (imageWrapperRef.current) {
          const rect = imageWrapperRef.current.getBoundingClientRect();
          const centerY = midPoint.y - rect.top;
          const centerX = midPoint.x - rect.left;

          imageWrapperRef.current.style.transformOrigin = `${centerX}px ${centerY}px`;
        }
      }

      if (e.touches.length === 2 && oneFingerMoveRef.current) {
        const midPoint = getMidpoint(e.touches[0], e.touches[1]);
        pinchLastXPositionRef.current = midPoint.x;
        pinchLastYPositionRef.current = midPoint.y;
      }
    },
    [getDistance, getMidpoint]
  );

  /////////////////////////////////////////////////////////////////

  const resetSlider = useCallback(() => {
    accumulateDeltaRef.current = 0;
    sliderRef.current.style.transition = 'none';
  }, []);

  /////////////////////////////////////////////////////////////////

  const slide = useCallback(
    (e) => {
      e.preventDefault();

      if (hasSwipedRef.current || isPinchingRef.current) return;

      const slider = sliderRef.current;
      const deltaX = e.touches[0].clientX - lastMoveXPositionRef.current;

      accumulateDeltaRef.current += deltaX;
      lastMoveXPositionRef.current = e.touches[0].clientX;

      const newTranslate =
        -33.33 + accumulateDeltaRef.current / DRAG_SENSITIVITY;

      if (accumulateDeltaRef.current > SWIPE_THRESHOLD) {
        slider.style.transform = `translateX(0%)`;
        slider.style.transition = 'transform 0.3s ease';

        slider.removeEventListener('touchmove', handleTouchMoveRef.current);
        hasSwipedRef.current = true;

        setTimeout(() => {
          toTheLeft();
          resetSlider();
        }, 300);
      } else if (accumulateDeltaRef.current < -SWIPE_THRESHOLD) {
        slider.style.transform = `translateX(-66.66%)`;
        slider.style.transition = 'transform 0.3s ease';

        slider.removeEventListener('touchmove', handleTouchMoveRef.current);
        hasSwipedRef.current = true;

        setTimeout(() => {
          toTheRight();
          resetSlider();
        }, 300);
      } else {
        slider.style.transform = `translateX(${newTranslate}%)`;
      }
    },
    [resetSlider, toTheLeft, toTheRight]
  );

  ////////////////////////////////////////////////////////////////////

  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches.length === 2 && !oneFingerMoveRef.current) {
        e.preventDefault();
        isPinchingRef.current = true;

        const newDistnce = getDistance(e.touches[0], e.touches[1]);
        const newMidPoint = getMidpoint(e.touches[0], e.touches[1]);

        const deltaX = newMidPoint.x - pinchLastXPositionRef.current;
        pinchAccumulateDeltaX.current += deltaX;
        pinchLastXPositionRef.current = newMidPoint.x;
        const translateX = pinchAccumulateDeltaX.current / 3;

        const deltaY = newMidPoint.y - pinchLastYPositionRef.current;
        pinchAccumulateDeltaY.current += deltaY;
        pinchLastYPositionRef.current = newMidPoint.y;
        const translateY = pinchAccumulateDeltaY.current / 3;

        const scale = newDistnce / pinchingStartDistanceRef.current;
        currentScaleRef.current = Math.max(1, Math.min(scale, 4));

        if (imageWrapperRef.current) {
          imageWrapperRef.current.style.transition = 'none';
          imageWrapperRef.current.style.transform = `scale(${currentScaleRef.current}) translateX(${translateX}px) translateY(${translateY}px)`;
        }

        return;
      }

      ///////////////////////////////////////////////////////////////////////////

      if (e.touches.length === 2 && oneFingerMoveRef.current) {
        e.preventDefault();

        if (imageWrapperRef.current) {
          imageWrapperRef.current.style.transition = 'none';
          imageWrapperRef.current.style.transform = `scale(${
            currentScaleRef.current
          }) translateX(${pinchAccumulateDeltaX.current / 3}px) translateY(${
            pinchAccumulateDeltaY.current / 3
          }px)`;
        }

        const newMidPoint = getMidpoint(e.touches[0], e.touches[1]);

        const deltaX = newMidPoint.x - pinchLastXPositionRef.current;
        pinchAccumulateDeltaX.current += deltaX;
        pinchLastXPositionRef.current = newMidPoint.x;

        const deltaY = newMidPoint.y - pinchLastYPositionRef.current;
        pinchAccumulateDeltaY.current += deltaY;
        pinchLastYPositionRef.current = newMidPoint.y;
      }

      ///////////////////////////////////////////////////////////////////////////////////

      if (e.touches.length === 1 && isPinchingRef.current) {
        e.preventDefault();
        oneFingerMoveRef.current = true;

        if (imageWrapperRef.current) {
          imageWrapperRef.current.style.transition = 'none';
          imageWrapperRef.current.style.transform = `scale(${
            currentScaleRef.current
          }) translateX(${pinchAccumulateDeltaX.current / 3}px) translateY(${
            pinchAccumulateDeltaY.current / 3
          }px)`;
        }

        const deltaX =
          e.touches[0].clientX - lastMoveOneFingerXPositionRef.current;
        pinchAccumulateDeltaX.current += deltaX;
        lastMoveOneFingerXPositionRef.current = e.touches[0].clientX;

        const deltaY =
          e.touches[0].clientY - lastMoveOneFingerYPositionRef.current;
        pinchAccumulateDeltaY.current += deltaY;
        lastMoveOneFingerYPositionRef.current = e.touches[0].clientY;
      }

      ///////////////////////////////////////////////////////////////////////////////

      if (e.touches.length === 1 && !isPinchingRef.current) slide(e);
    },
    [slide, getDistance, getMidpoint]
  );

  handleTouchMoveRef.current = handleTouchMove;

  /////////////////////////////////////////////////////////

  const handleTouchEnd = useCallback(
    (e) => {
      const slider = sliderRef.current;

      if (e.touches.length === 0) {
        isPinchingRef.current = false;

        if (imageWrapperRef.current) {
          imageWrapperRef.current.style.transform = 'scale(1)';
          imageWrapperRef.current.style.transition = 'transform 0.4s ease';
        }

        pinchingStartDistanceRef.current = null;
        pinchAccumulateDeltaX.current = 0;
        pinchAccumulateDeltaY.current = 0;
        oneFingerMoveRef.current = false;
      }

      if (e.touches.length === 1 && isPinchingRef.current) {
        lastMoveOneFingerXPositionRef.current = e.touches[0].clientX;
        lastMoveOneFingerYPositionRef.current = e.touches[0].clientY;
      }

      hasSwipedRef.current = false;

      if (Math.abs(accumulateDeltaRef.current) === 0) {
        return;
      }

      if (Math.abs(accumulateDeltaRef.current) <= SWIPE_THRESHOLD) {
        slider.style.transform = `translateX(-33.33%)`;
        slider.style.transition = 'transform 0.3s ease';
      }

      accumulateDeltaRef.current = 0;
      slider.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
    },
    [handleTouchMove]
  );

  ////////////////////////////////////////////////////////////////////
  useLayoutEffect(() => {
    const slider = sliderRef.current;
    slider.style.transform = `translateX(-33.33%)`;
    slider.style.transition = 'none';
  }, [imageIndex]);

  /////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////

  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Helmet>
      <div
        ref={sliderRef}
        onTouchStart={(e) => handleTouchStart(e)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="sliderElement"
        style={{ touchAction: 'none' }}
      >
        <div className="imageelemntWrapper">
          <div className="imageSlider-imageWrapper" style={prevImageStyle}>
            <img
              src={
                API_URL +
                galleryData.images[
                  imageIndex === 0
                    ? galleryData.images.length - 1
                    : imageIndex - 1
                ].path
              }
              alt={
                galleryData.images[
                  imageIndex === 0
                    ? galleryData.images.length - 1
                    : imageIndex - 1
                ].altText || 'Wedding-photography'
              }
              className="imageSlider-image"
            />
          </div>
        </div>
        <div className="imageelemntWrapper" ref={imageWrapperRef}>
          <div
            // layoutId={hasAnimatedRef.current ? undefined : `image-${imageIndex}`}
            // transition={{ type: 'spring', duration: 0.5 }}
            className="imageSlider-imageWrapper"
            style={currentImageStyle}
          >
            <img
              src={API_URL + galleryData.images[imageIndex].path}
              alt={
                galleryData.images[imageIndex].altText || 'Wedding-photography'
              }
              className="imageSlider-image"
            />
          </div>
        </div>
        <div className="imageelemntWrapper">
          <div className="imageSlider-imageWrapper" style={nextImageStyle}>
            <img
              src={
                API_URL +
                galleryData.images[
                  imageIndex === galleryData.images.length - 1
                    ? 0
                    : imageIndex + 1
                ].path
              }
              alt={
                galleryData.images[
                  imageIndex === galleryData.images.length - 1
                    ? 0
                    : imageIndex + 1
                ].altText || 'Wedding-photography'
              }
              className="imageSlider-image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSliderElement;
