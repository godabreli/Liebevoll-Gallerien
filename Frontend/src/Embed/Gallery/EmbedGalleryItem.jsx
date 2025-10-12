import React, { useCallback, useRef } from 'react';

const EmbedGalleryItem = (props) => {
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
    <div className={props.className} style={{ ...props.itemStyle }}>
      {props.downloadFunction && (
        <div
          className={props.checkBoxClassname}
          onClick={props.checkBoxOnClick}
        >
          {props.checkBoxContent}
        </div>
      )}
      <img
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: '0.5s',
          cursor: 'pointer',
        }}
        className="embedGalleryItemImage"
        src={props.imageSrc}
        alt={props.alt}
        onClick={onClickHandler}
        onTouchStart={props.downloadFunction ? touchStartHandler : undefined}
        onTouchEnd={touchEndHandler}
        onTouchMove={() => {
          isTouchMoveRef.current = true;
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default EmbedGalleryItem;
