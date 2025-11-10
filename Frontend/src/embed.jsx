import React from 'react';
import { createRoot } from 'react-dom/client';
import EmbedGallery from './Embed/Gallery/EmbedGallery';

import embedGalleryStyles from './Embed/Gallery/EmbedGallery.css?inline';
import embedGalleryItemStyles from './Embed/Gallery/EmbedGalleryItem.css?inline';
import embedSliderStyles from './Embed/Gallery/EmbedSlider.css?inline';
import EmbedGalleryLoginStyles from './Embed/Gallery/EmbedGalleryLogin.css?inline';
import EmbedMassonryRowStyle from './Embed/Gallery/EmbedMasonryRow.css?inline';
import EmbedDesctopSliderElementStyle from './Embed/Gallery/EmbedDesctopSliderElement.css?inline';
import EmbedMobileSliderElementStyle from './Embed/Gallery/EmbedMobileSliderElement.css?inline';
import LoadingSpinnerStyle from './Embed/UI-Components/EmbedLoadingSpinner.css?inline';

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
    EmbedGalleryLoginStyles +
    '\n' +
    EmbedMassonryRowStyle +
    '\n' +
    EmbedDesctopSliderElementStyle +
    '\n' +
    EmbedMobileSliderElementStyle +
    '\n' +
    LoadingSpinnerStyle; // Alle Styles zusammenfügen
  document.head.appendChild(styleTag);

  const scriptTag = document.getElementById('embed-gallery-script');
  const container = scriptTag.parentNode;

  const oldRoot = container.querySelector('.embed-gallery-root');
  if (oldRoot) {
    oldRoot.remove();
  }

  const galleryRoot = document.createElement('div');
  galleryRoot.className = 'embed-gallery-root';
  container.appendChild(galleryRoot);

  const galleryName = scriptTag.dataset.galleryName || 'default';
  const mode = scriptTag.dataset.mode || 'dark';

  const root = createRoot(galleryRoot);
  root.render(<EmbedGallery galleryName={galleryName} mode={mode} />);
})();
