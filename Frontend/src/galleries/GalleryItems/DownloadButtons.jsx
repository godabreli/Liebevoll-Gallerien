import React from 'react';

import './DownloadButtons.css';
import Button from '../../shared/form-elements/Button';

const DownloadButtons = (props) => {
  return (
    <div className="download-buttons">
      <div className="buttonWrapper">
        <Button size="small" onClick={props.downloadAll}>
          ALLE HERUNTERLADEN
        </Button>
      </div>
      <div className="buttonWrapper">
        <Button
          onClick={props.downloadSelection}
          disabled={!props.downloadsArrey.length > 0}
          size="small"
        >
          {props.downloadsArrey.length > 0
            ? `${props.downloadsArrey.length} ${
                props.downloadsArrey.length > 1 ? 'BILDER' : 'BILD'
              } HERUNTERLADEN`
            : 'AUSWAHL HERUNTERLADEN'}
        </Button>
      </div>
    </div>
  );
};

export default DownloadButtons;
