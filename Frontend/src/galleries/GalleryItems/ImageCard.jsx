import React from 'react';

import Card from '../../shared/ui-elements/Card';
import Button from '../../shared/form-elements/Button';

import './ImageCard.css';

const ImageCard = ({
  deleteImage,
  item,
  imagePath,
  i,
  markedForDeletion,
  setImageFiles,
  setMarkedForDeletion,
}) => {
  return (
    <Card className="select-images-card">
      <div
        className="image-input-deleteButton-wrapper"
        style={{ height: markedForDeletion === item ? '78%' : '100%' }}
      >
        <img src={imagePath} alt="selected Image" className="selected-image" />
        <div className="input-deletButtonWrapper">
          <div className="image-alt-text-wrapper">
            <p className="alt-text-input-lable">Alt-Text:</p>
            <input
              className="image-alt-text-input"
              id={`alt-text-input-${i}`}
              type="text"
              value={item.altText}
              onChange={(e) => {
                setImageFiles((prev) =>
                  prev.map((image, index) =>
                    index === i ? { ...image, altText: e.target.value } : image
                  )
                );
              }}
            />
          </div>
          <div className="delete-button-wrapper">
            <Button
              danger
              size="very-small"
              onClick={() => setMarkedForDeletion(item)}
            >
              DELETE
            </Button>
          </div>
        </div>
      </div>
      {markedForDeletion === item && (
        <div className="delete-selected-image-wrapper">
          <p className="delete-image-warning">
            {window.innerWidth > 768 ? 'Marked for deletion!' : 'DELETE?'}
          </p>
          <Button
            size="very-small"
            ok
            onClick={() => setMarkedForDeletion(null)}
          >
            CANCEL
          </Button>
          <Button
            size="very-small"
            danger
            onClick={() => {
              setMarkedForDeletion(null);
              deleteImage();
            }}
          >
            DELETE
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ImageCard;
