import React from 'react';
import { createRoot } from 'react-dom/client';
import EmbedGallery from './Embed/Gallery/EmbedGallery';

import embedGalleryStyles from './Embed/Gallery/EmbedGallery.css?inline';
import embedGalleryItemStyles from './Embed/Gallery/EmbedGalleryItem.css?inline';
import embedSliderStyles from './Embed/Gallery/EmbedSlider.css?inline';
import mobileSliderElementStyles from './galleries/GalleryItems/MobileSliderElement.css?inline';
import desctopSliderElementStyles from './galleries/GalleryItems/DesctopSliderElement.css?inline';
import EmbedGalleryLoginStyles from './Embed/Gallery/EmbedGalleryLogin.css?inline';
import EmbedMassonryRowStyle from './Embed/Gallery/EmbedMasonryRow.css?inline';
import EmbedDesctopSliderElementStyle from './Embed/Gallery/EmbedDesctopSliderElement.css?inline';

(function () {
  // 1. INJEKTIERE CSS
  const styleTag = document.createElement('style');
  styleTag.textContent =
    embedGalleryStyles +
    '\n' +
    embedGalleryItemStyles +
    '\n' +
    embedSliderStyles +
    '\n' +
    mobileSliderElementStyles +
    '\n' +
    desctopSliderElementStyles +
    '\n' +
    EmbedGalleryLoginStyles +
    '\n' +
    EmbedMassonryRowStyle +
    '\n' +
    EmbedDesctopSliderElementStyle; // Alle Styles zusammenfügen
  document.head.appendChild(styleTag);

  const scriptTag = document.currentScript;
  const container = scriptTag.parentNode;

  const galleryName = scriptTag.dataset.galleryName || 'default';

  const galleryRoot = document.createElement('div');
  container.appendChild(galleryRoot);

  const root = createRoot(galleryRoot);
  root.render(<EmbedGallery galleryName={galleryName} />);
})();
