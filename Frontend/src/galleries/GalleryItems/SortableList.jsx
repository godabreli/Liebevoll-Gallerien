import React, { useState, useRef, useCallback, useEffect } from 'react';

import './SortableList.css';

const touchOptions = { passive: false };

const SortableList = ({
  array,
  renderItem,
  setArray,
  itemHeight,
  gap,
  markedForDeletion,
}) => {
  const [visualPositions, setVisualPositions] = useState(array.map(() => 0));
  const [activeItemIndex, setActiveItemIndex] = useState();
  const [isDragMove, setIsDragMove] = useState(false);

  const dragArrayRef = useRef([...array]);
  const startYPositionRef = useRef();
  const acumulateDeltaRef = useRef(0);
  const lastMoveYposRef = useRef(0);
  const lastSwappedIndexRef = useRef();
  const previousDirectionRef = useRef();
  const wrapperRef = useRef();
  const itemsRef = useRef([]);

  /////////////////////////////////////////////////////

  const handleMouseDown = (e, index) => {
    if (index >= 0) {
      setIsDragMove(true);
      setActiveItemIndex(index);
      startYPositionRef.current = e.clientY;
      lastMoveYposRef.current = e.clientY;
    }
  };

  ////////////////////////////////////////////////////////

  const handleMouseUp = useCallback(() => {
    setIsDragMove(false);
    setActiveItemIndex(null);
    setArray(dragArrayRef.current);
    setVisualPositions(array.map(() => 0));
    acumulateDeltaRef.current = 0;
    lastSwappedIndexRef.current = undefined;
    previousDirectionRef.current = undefined;
  }, [array, setArray]);

  ////////////////////////////////////////////////////////

  const moveElementInDragArray = useCallback(
    (fromIndex, toIndex, animateIndex, moveDirection) => {
      if (toIndex < 0 || toIndex >= dragArrayRef.current.length) {
        return;
      }

      const tempArray = [...dragArrayRef.current];
      const movedElement = tempArray.splice(fromIndex, 1)[0];
      tempArray.splice(toIndex, 0, movedElement);
      dragArrayRef.current = tempArray;

      const newPositions = [...visualPositions];
      if (moveDirection > 0) {
        newPositions[animateIndex] -= itemHeight + gap;
      } else {
        newPositions[animateIndex] += itemHeight + gap;
      }
      setVisualPositions(newPositions);
    },
    [visualPositions, gap, itemHeight]
  );

  /////////////////////////////////////////////////////////////////////////////

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragMove || activeItemIndex === undefined) return;

      const deltaY = e.clientY - startYPositionRef.current;

      const dy = e.clientY - lastMoveYposRef.current;

      const activeItem = itemsRef.current[activeItemIndex];

      if (activeItem) {
        activeItem.style.transform = `translateY(${deltaY}px) scale(1.03)`;
      }

      acumulateDeltaRef.current += dy;
      lastMoveYposRef.current = e.clientY;

      const wrapperRect = wrapperRef.current?.getBoundingClientRect();

      if (
        !wrapperRect ||
        e.clientY < wrapperRect.top ||
        e.clientY > wrapperRect.bottom
      ) {
        acumulateDeltaRef.current = 0;
      }

      if (dy === 0) return;
      const moveDirection = dy > 0 ? 1 : -1;

      const fromIndex = dragArrayRef.current.findIndex(
        (el) => el === array[activeItemIndex]
      );

      const toIndex = fromIndex + moveDirection;

      let animateIndex = toIndex;

      if (
        previousDirectionRef.current != undefined &&
        previousDirectionRef.current === moveDirection
      )
        animateIndex = lastSwappedIndexRef.current + moveDirection;

      if (
        previousDirectionRef.current !== undefined &&
        previousDirectionRef.current !== moveDirection
      ) {
        animateIndex = lastSwappedIndexRef.current;
      }

      if (animateIndex === activeItemIndex) animateIndex += moveDirection;

      if (Math.abs(acumulateDeltaRef.current) > itemHeight) {
        if (toIndex >= 0 && toIndex < array.length) {
          moveElementInDragArray(
            fromIndex,
            toIndex,
            animateIndex,
            moveDirection
          );
          acumulateDeltaRef.current = 0;
          lastSwappedIndexRef.current = animateIndex;
          previousDirectionRef.current = moveDirection;
        }
      }
    },
    [isDragMove, activeItemIndex, moveElementInDragArray, array, itemHeight]
  );

  ////////////////////////////////////////////////////////////////////////////

  const handleTouchMove = useCallback(
    (e) => {
      e.preventDefault();
      handleMouseMove({
        clientY: e.touches[0].clientY,
      });
    },

    [handleMouseMove]
  );

  ///////////////////////////////////////////////////

  useEffect(() => {
    dragArrayRef.current = [...array];
    setVisualPositions(array.map(() => 0));
  }, [array]);

  //////////////////////////////////////////////////////

  useEffect(() => {
    if (isDragMove) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, touchOptions);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove, touchOptions);
      window.removeEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove, touchOptions);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragMove, handleMouseMove, handleMouseUp, handleTouchMove]);

  //////////////////////////////////////////////////////////////////////////////

  return (
    <div
      className="sortable-list-wrapper"
      ref={wrapperRef}
      style={{ gap: gap }}
    >
      {array.map((item, i) => (
        <div
          ref={(el) => (itemsRef.current[i] = el)}
          className={`list-item-wrapper ${
            isDragMove && activeItemIndex !== i ? 'animate-item-drag' : ''
          }  ${
            !isDragMove || activeItemIndex === i ? 'no-item-transition' : ''
          } ${isDragMove && activeItemIndex === i ? 'by-item-drag' : ''}`}
          key={i}
          style={{
            height: markedForDeletion === item ? itemHeight + 30 : itemHeight,
            zIndex: activeItemIndex === i ? 100 : 10,
            transform: `${
              activeItemIndex === i ? 'scale(1.03)' : ''
            } translateY(${visualPositions[i]}px)`,
          }}
        >
          {renderItem(item, i)}
          <div
            className="list-grab-button"
            onMouseDown={(e) => handleMouseDown(e, i)}
            onTouchStart={(e) =>
              handleMouseDown({ clientY: e.touches[0].clientY }, i)
            }
            style={{ touchAction: 'none' }}
          >
            &#8286;
          </div>
        </div>
      ))}
    </div>
  );
};

export default SortableList;
