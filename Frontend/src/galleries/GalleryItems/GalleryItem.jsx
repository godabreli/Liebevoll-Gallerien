import React, { useCallback, useRef } from 'react';
import { motion } from 'motion/react';

import './GalleryItem.css';

const GalleryItem = (props) => {
  const touchTimerRef = useRef();
  const isLongPressRef = useRef(false);
  const isTouchMoveRef = useRef(false);

  const onClickHandler = () => {
    if (isLongPressRef.current) {
      return;
    }
    props.imageOnClick();
  };

  const touchStartHandler = useCallback(() => {
    isLongPressRef.current = false;
    touchTimerRef.current = setTimeout(() => {
      if (!isTouchMoveRef.current) {
        props.imageLongPress();
      }

      isLongPressRef.current = true;
    }, 700);
  }, [props]);

  const touchEndHandler = useCallback(() => {
    clearTimeout(touchTimerRef.current);
    isTouchMoveRef.current = false;
  }, []);

  return (
    <motion.div
      layoutId={`image-${props.index}`}
      className={`galleryItem galleryItem-${props.galleryItemClassName}`}
      index={props.index}
      style={props.itemStyle}
    >
      {props.downloadFunction && (
        <button
          className={`download-checkBox download-checkBox-${props.checkBoxClassname}`}
          onClick={props.checkBoxHandler}
        >
          {props.checkBoxContent}
        </button>
      )}
      <img
        className="gallery-image"
        src={props.src}
        alt={props.alt}
        onClick={onClickHandler}
        onTouchStart={props.downloadFunction ? touchStartHandler : null}
        onTouchEnd={touchEndHandler}
        onTouchMove={() => {
          isTouchMoveRef.current = true;
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </motion.div>
  );
};

export default GalleryItem;
