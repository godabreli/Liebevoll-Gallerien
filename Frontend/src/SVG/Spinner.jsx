import * as React from 'react';
const Spinner = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Ebene 1"
    viewBox="0 0 388.71 421.28"
    {...props}
  >
    <path
      d="M210.64 421.28C94.49 421.28 0 326.79 0 210.64S94.49 0 210.64 0c70.06 0 135.34 34.7 174.63 92.82l-32.31 21.84C320.94 67.29 267.74 39 210.64 39 116 39 39 116 39 210.64s77 171.64 171.64 171.64c59.17 0 113.42-29.88 145.12-79.94l32.95 20.87c-18.65 29.45-44.56 54.04-74.91 71.12-31.33 17.63-67 26.95-103.16 26.95Z"
      style={{
        fill: props.color,
      }}
    />
  </svg>
);
export default Spinner;
