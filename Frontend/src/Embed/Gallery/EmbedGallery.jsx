import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import EmbedMasonryRow from './EmbedMasonryRow';
import EmbedGalleryLogin from './EmbedGalleryLogin';
import DownloadButton02 from '../../SVG/Downloadbutton02';

import { useEmbedAuthHook } from '../embed-auth-hook';

import { API_URL } from '../../util/globalURLS';

import { DownloadsContext } from './downloads-context';

const EmbedGallery = (props) => {
  const {
    galleryToken,
    galleryIsLoggedIn,
    isAuthenticating,
    galleryLogin,
    galleryLogout,
  } = useEmbedAuthHook();

  const galleryName = props.galleryName;

  const [galleryData, setGalleryData] = useState(null);
  const [galleryWidth, setGalleryWidth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schowScrollToTop, setShowScrollToTop] = useState(false);
  const [showDropdownMenue, setShowDropdownMenue] = useState(false);
  const [animateDropDownMenue, setAnimateDropDownMenue] = useState(true);
  const [downloads, setDownloads] = useState([]);
  const [checkBoxIsActive, setCheckBoxIsActive] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showGallery, setShowGallery] = useState(true);

  const galleryWraperRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://liebevollbelichtet.de/api/galleries/my-galleries/${galleryName}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch gallery data.');
        }

        const data = await res.json();

        if (data.data.isProtected) {
          if (!isAuthenticating && galleryIsLoggedIn) {
            const res = await fetch(
              `https://liebevollbelichtet.de/api/galleries/get-gallery/${galleryName}`,
              {
                method: 'GET',
                headers: { Authorization: 'Bearer ' + galleryToken },
              }
            );
            if (!res.ok) {
              throw new Error('Failed to fetch gallery data.');
            }

            const data = await res.json();

            setGalleryData(data.data);
            setIsLoading(false);
            return;
          } else if (!isAuthenticating && !galleryIsLoggedIn) {
            setIsLoading(false);
            setShowLogin(true);
            setShowGallery(false);
          }
        } else {
          setGalleryData(data.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [galleryName, galleryIsLoggedIn, galleryToken, isAuthenticating]);

  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (galleryWraperRef.current && galleryData) {
      const width = galleryWraperRef.current.offsetWidth;
      setGalleryWidth(width);

      const handleResize = () =>
        setGalleryWidth(galleryWraperRef.current.offsetWidth);
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [galleryData]);

  /////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const onScroll = () => {
      setShowScrollToTop(window.scrollY > 1000);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  ////////////////////////////////////////////////////////////////////////////////

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  ///////////////////////////////////////////////////////////////////////////////

  const downloadHandler = async (paths) => {
    const imagePaths = paths.map((path) => {
      const parts = path.split('/');
      parts.splice(2, 1);
      return parts.join('/');
    });

    try {
      setIsLoading(true);

      const response = await fetch(
        'https://liebevollbelichtet.de/api/galleries/downloads/download-images',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + galleryToken,
          },
          body: JSON.stringify({
            imagePaths,
            galleryId: galleryData.Id,
            authType: 'gallery',
          }),
        }
      );

      if (!response.ok) {
        setIsLoading(false);
        console.error('Fehler beim Herunterladen');
        return;
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  ////////////////////////////////////////////////////////////////////////

  const downloadAllHandler = () => {
    const allImagesPaths = galleryData.images.map((image) => image.path);
    downloadHandler(allImagesPaths);
  };

  ///////////////////////////////////////////////////////////////////////////////

  const oneImageDownloadHandler = async (index) => {
    const imagePath = `uploads/galleries/${galleryData.name}/${galleryData.images[index].name}`;

    try {
      const response = await fetch(
        'https://liebevollbelichtet.de/api/galleries/downloads/download-one-image',
        {
          method: 'POST',
          body: JSON.stringify({
            imagePath,
            galleryId: galleryData.Id,
            authType: 'gallery',
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${galleryToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Download fehlgeschlagen: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = galleryData.images[index].name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////

  const logOut = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setAnimateDropDownMenue(false);
    setShowDropdownMenue(false);
    galleryLogout();
  };

  if (isLoading || isAuthenticating) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>LOADING...</h1>
      </div>
    );
  }

  console.log(showGallery);

  return (
    <div className="embedGalleryWrapper" ref={galleryWraperRef}>
      {galleryData && galleryData.isProtected && galleryIsLoggedIn && (
        <div className="embedGalleryButtonsWrapper">
          <div
            className="embedGalleryButton embedGalleryButton-logout"
            onClick={(e) => logOut(e)}
          >
            LOGOUT
          </div>
          <div
            className="embedGalleryButton embedGalleryButton-menue"
            onClick={() => setShowDropdownMenue(true)}
          >
            <DownloadButton02 color="#1d1d1b" strokeWidth="8" />
          </div>
        </div>
      )}
      <AnimatePresence>
        {showDropdownMenue && (
          <div
            className="embedGalleryDropdownMenueWrapper"
            onClick={() => setShowDropdownMenue(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
              exit={
                animateDropDownMenue
                  ? {
                      scale: 0,
                      transition: { duration: 0.2, ease: 'easeIn' },
                    }
                  : undefined
              }
              className="embedGalleryDropdownMenue"
            >
              <ul className="embedGalleryDropdownMenueLinks">
                <li>
                  <div
                    className="embedGalleryButton embedGalleryButton-dropdownMenue"
                    onClick={downloadAllHandler}
                  >
                    DOWNLOAD ALL
                  </div>
                </li>
                <li>
                  <div
                    className={`embedGalleryButton embedGalleryButton-dropdownMenue ${
                      downloads.length === 0
                        ? 'embedGalleryButton-disabled'
                        : ''
                    }`}
                    onClick={() =>
                      downloads.length > 0
                        ? downloadHandler(downloads)
                        : undefined
                    }
                  >
                    DOWNLOAD SELECTED
                  </div>
                </li>
                <li>
                  <div
                    className="embedGalleryButton embedGalleryButton-dropdownMenue"
                    onClick={() => {
                      if (downloads.length === 0) return;
                      setDownloads([]);
                      setCheckBoxIsActive({});
                    }}
                  >
                    CANCEL CELECTION
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {window.innerWidth < 768 && (
        <div
          className={`scrollToTop ${
            schowScrollToTop ? 'scrollToTop-visible' : ''
          }`}
          onClick={scrollToTop}
        >
          {'>'}
        </div>
      )}

      {!galleryIsLoggedIn && showLogin && (
        <EmbedGalleryLogin logIn={galleryLogin} />
      )}

      <DownloadsContext.Provider
        value={{
          downloads,
          setDownloads,
          checkBoxIsActive,
          setCheckBoxIsActive,
          oneImageDownloadHandler,
        }}
      >
        {showGallery && (
          <EmbedMasonryRow
            galleryData={galleryData}
            galleryWidth={galleryWidth}
          />
        )}
      </DownloadsContext.Provider>
    </div>
  );
};

export default EmbedGallery;
