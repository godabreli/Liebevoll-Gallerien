import * as React from 'react';
const DownloadButton02 = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Ebene 1"
    viewBox="0 0 412.81 401.8"
    {...props}
  >
    <path
      d="M358.52 401.8H54.29C24.35 401.8 0 377.44 0 347.51V280.6h27v66.91c0 15.05 12.24 27.29 27.29 27.29h304.23c15.05 0 27.29-12.24 27.29-27.29V280.6h27v66.91c0 29.94-24.36 54.29-54.29 54.29Zm-70.57-179-66.82 71.89V0h-28v294.73l-66.85-71.93-17.64 16.43 98.46 105.9 98.48-105.9-17.64-16.43Z"
      style={{
        fill: props.color,
        stroke: props.strokeColor || props.color, // Umrandungsfarbe
        strokeWidth: props.strokeWidth || 0, // Dicke der Linie
        strokeLinejoin: 'round', // optionale Abrundung an Ecken
        strokeLinecap: 'round', // optionale Abrundung an Enden
      }}
    />
  </svg>
);
export default DownloadButton02;
