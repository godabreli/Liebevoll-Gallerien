import React, { useState, useCallback, useEffect } from 'react';

let galleryLogoutTimer;

export const useEmbedAuthHook = () => {
  const [galleryToken, setGalleryToken] = useState(null);
  const [galleryId, setGalleryId] = useState(null);
  const [galleryIsLoggedIn, setGalleryIsLoggedIn] = useState(false);
  const [galleryTokenExpirationDate, setGalleryTokenExpirationDate] =
    useState();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const galleryLogin = useCallback(
    (galId, galToken, galTokenExpirationDate) => {
      setGalleryId(galId);
      setGalleryToken(galToken);
      setGalleryIsLoggedIn(true);
      const tokenExpirationDate =
        galTokenExpirationDate || Date.now() + 1000 * 60 * 60 * 12;
      setGalleryTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        'galleryData',
        JSON.stringify({
          galleryId: galId,
          galleryToken: galToken,
          expiration: tokenExpirationDate,
        })
      );
      setIsAuthenticating(false);
    },
    []
  );

  const galleryLogout = useCallback(() => {
    setGalleryId(null);
    setGalleryToken(null);
    setGalleryIsLoggedIn(false);
    setGalleryTokenExpirationDate(null);
    localStorage.removeItem('galleryData');
    setIsAuthenticating(false);
  }, []);

  useEffect(() => {
    if (galleryToken && galleryTokenExpirationDate) {
      const remainingTime = galleryTokenExpirationDate - Date.now();
      galleryLogoutTimer = setTimeout(galleryLogout, remainingTime);
    }
    return () => clearTimeout(galleryLogoutTimer);
  }, [galleryToken, galleryTokenExpirationDate, galleryLogout]);

  useEffect(() => {
    const storedGalleryData = JSON.parse(localStorage.getItem('galleryData'));

    if (!storedGalleryData) {
      setIsAuthenticating(false);
    }

    if (
      storedGalleryData &&
      storedGalleryData.galleryToken &&
      storedGalleryData.expiration > Date.now()
    ) {
      galleryLogin(
        storedGalleryData.galleryId,
        storedGalleryData.galleryToken,
        storedGalleryData.expiration
      );
    }
  }, [galleryLogin]);

  return {
    galleryToken,
    galleryId,
    galleryIsLoggedIn,
    isAuthenticating,
    galleryLogin,
    galleryLogout,
  };
};
