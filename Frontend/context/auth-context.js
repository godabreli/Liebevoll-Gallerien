import { createContext } from 'react';

export const AuthContext = createContext({
  userIsLoggedIn: false,
  userId: null,
  userToken: null,
  galleryIsLoggedIn: false,
  galleryId: null,
  galleryToken: null,
  userLogin: () => {},
  userLogout: () => {},
  galleryLogin: () => {},
  galleryLogout: () => {},
});
