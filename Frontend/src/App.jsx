import './App.css';

import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import MyGallery from './pages/MyGallery';
import AboutMe from './pages/AboutMe';
import Galleries from './galleries/pages/Galleries';
import Contact from './pages/Contact';
import UserLogin from './users/pages/UserLogin';
import CreateGallery from './galleries/pages/CreateGallery';
import Header from './shared/navigation/Header';
import GalleryLogin from './galleries/pages/GalleryLogin';
import Gallery from './galleries/GalleryItems/Gallery';
import EditGallery from './galleries/pages/EditGallery';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';

import { useAuth } from './shared/hooks/auth-hook';
import { AuthContext } from '../context/auth-context';
import { Footer } from './shared/navigation/Footer';

function App() {
  const {
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
  } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userToken !== undefined && galleryToken !== undefined) {
      setLoading(false);
    }
  }, [userToken, galleryToken]);

  if (loading) {
    return <div>LOADING...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      <Header />
      <div className="spaceForFooter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-gallery/:myGalleryName" element={<MyGallery />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login-gallery" element={<GalleryLogin />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="datenschutzerklaerung" element={<Datenschutz />} />
          <Route
            path="/create-gallery"
            element={
              userToken ? <CreateGallery /> : <Navigate to="/users/login" />
            }
          />
          <Route
            path="/edit-gallery/:galleryId"
            element={
              userToken ? <EditGallery /> : <Navigate to="/users/login" />
            }
          />
          <Route
            path="/my-galleries"
            element={userToken ? <Galleries /> : <Navigate to="/users/login" />}
          />
          <Route
            path="/my-galleries/:galleryName"
            element={
              galleryToken ? <Gallery /> : <Navigate to="/login-gallery" />
            }
          />
          <Route
            path="/users/login"
            element={!userToken ? <UserLogin /> : <Navigate to="/galleries" />}
          />
          <Route
            path="/user-gallery/:galleryId"
            element={userToken ? <Gallery /> : <Navigate to="/users/login" />}
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
