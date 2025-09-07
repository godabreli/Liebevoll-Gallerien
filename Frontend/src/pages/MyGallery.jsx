import React from 'react';

import Card from '../shared/ui-elements/Card';

import './MyGallery.css';
import SortableList from '../galleries/GalleryItems/SortableList';
import Gallery from '../galleries/GalleryItems/Gallery';
import { Helmet } from 'react-helmet';

function MyGallery() {
  return (
    <>
      <Helmet>
        <title>Hochzeitsfotos für die Inspiration</title>
        <meta
          name="description"
          content="Eine Galerie von unvergeslichen Momenten. Hochzeitsfotos die begeistern.  "
        />
        <link rel="canonical" href="https://liebevollbelichtet.de/Galerie" />
      </Helmet>
      <div className="myGallery-wraper">
        <Gallery />
      </div>
    </>
  );
}

export default MyGallery;
