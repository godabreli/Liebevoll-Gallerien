import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner(props) {
  return (
    <div
      className={`loading-spinner loading-spinner--position-${
        props.position || 'default'
      }`}
    >
      <span
        className={`icon-spinner6 icon-loading--${props.size || 'default'}`}
      ></span>
    </div>
  );
}

export default LoadingSpinner;
