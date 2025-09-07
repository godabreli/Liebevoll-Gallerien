import { useCallback, useEffect, useState } from 'react';

let userLogOutTimer;
let galleryLogoutTimer;

export const useAuth = () => {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [userTokenExpirationDate, setUserTokenExpirationDate] = useState(null);
  const [galleryToken, setGalleryToken] = useState(null);
  const [galleryId, setGalleryId] = useState(null);
  const [galleryIsLoggedIn, setGalleryIsLoggedIn] = useState(false);
  const [galleryTokenExpirationDate, setGalleryTokenExpirationDate] =
    useState();

  const userLogin = useCallback((uId, userToken, userTokenExpirationDate) => {
    setUserId(uId);
    setUserToken(userToken);
    setUserIsLoggedIn(true);
    const tokenExpirationDate =
      userTokenExpirationDate || Date.now() + 1000 * 60 * 60 * 12;
    setUserTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uId,
        userToken,
        expiration: tokenExpirationDate,
      })
    );
  }, []);

  const userLogout = useCallback(() => {
    setUserToken(null);
    setUserIsLoggedIn(false);
    setUserId(null);
    setUserTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

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
    },
    []
  );

  const galleryLogout = useCallback(() => {
    setGalleryId(null);
    setGalleryToken(null);
    setGalleryIsLoggedIn(false);
    setGalleryTokenExpirationDate(null);
    localStorage.removeItem('galleryData');
  }, []);

  useEffect(() => {
    if (userToken && userTokenExpirationDate) {
      const remainingTime = userTokenExpirationDate - Date.now();
      userLogOutTimer = setTimeout(userLogout, remainingTime);
    }
    return () => clearTimeout(userLogOutTimer);
  }, [userToken, userTokenExpirationDate, userLogout]);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    if (
      storedUserData &&
      storedUserData.userToken &&
      storedUserData.expiration > Date.now()
    ) {
      userLogin(
        storedUserData.userId,
        storedUserData.userToken,
        storedUserData.expiration
      );
    }
  }, [userLogin]);

  useEffect(() => {
    if (galleryToken && galleryTokenExpirationDate) {
      const remainingTime = galleryTokenExpirationDate - Date.now();
      galleryLogoutTimer = setTimeout(galleryLogout, remainingTime);
    }
    return () => clearTimeout(galleryLogoutTimer);
  }, [galleryToken, galleryTokenExpirationDate, galleryLogout]);

  useEffect(() => {
    const storedGalleryData = JSON.parse(localStorage.getItem('galleryData'));
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
    userIsLoggedIn,
    userToken,
    userId,
    galleryIsLoggedIn,
    galleryToken,
    galleryId,
    userLogin,
    userLogout,
    galleryLogin,
    galleryLogout,
  };
};
