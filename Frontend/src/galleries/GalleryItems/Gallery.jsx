import React, { useContext, useEffect, useState, useMemo } from 'react';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../../context/auth-context';

import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../shared/ui-elements/LoadingSpinner';
import MasonryRow from './MasonryRow';
import ErrorModal from '../../shared/ui-elements/ErrorModal';

import './Gallery.css';

import { API_URL } from '../../util/globalURLS';

function Gallery() {
  const { myGalleryName, galleryName, galleryId } = useParams();
  const auth = useContext(AuthContext);
  const [galleryData, setGalleryData] = useState();
  const [galleryWidth, setGalleryWidth] = useState();
  const [schowScrollToTop, setShowScrollToTop] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  ///////////////////////////////////////////////////////////////////////////////

  const link = useMemo(() => {
    if (myGalleryName && galleryName === undefined && galleryId === undefined) {
      return `${API_URL}api/galleries/my-galleries/${myGalleryName}`;
    }
    if (galleryName && galleryId === undefined && myGalleryName === undefined) {
      return `${API_URL}api/galleries/get-gallery/${galleryName}`;
    }
    if (galleryId && galleryName === undefined && myGalleryName === undefined) {
      return `${API_URL}api/galleries/get-user-gallery/${galleryId}`;
    }
    return null;
  }, [galleryName, galleryId, myGalleryName]);

  /////////////////////////////////////////////////////////////////////////

  const header = useMemo(() => {
    if (galleryName && galleryId === undefined) {
      return {
        Authorization: 'Bearer ' + auth.galleryToken,
      };
    }

    if (galleryId && galleryName === undefined) {
      return {
        Authorization: 'Bearer ' + auth.userToken,
      };
    }

    return {};
  }, [auth.galleryToken, auth.userToken, galleryId, galleryName]);

  ///////////////////////////////////////////////////////////////////

  useEffect(() => {
    const handleResize = () => {
      setGalleryWidth(
        window.innerWidth > 1100
          ? window.innerWidth * 0.8
          : window.innerWidth * 0.95
      );
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  ///////////////////////////////////////////////////////////////////

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(link, 'GET', null, header);
        setGalleryData(responseData.data);
      } catch (err) {
        console.error(`Error by getting the data: ${err}`);
      }
    };
    if (link) getData();
  }, [galleryName, galleryId, header, link, sendRequest, auth.galleryToken]);

  ////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const onScroll = () => {
      setShowScrollToTop(window.scrollY > 1000);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  ////////////////////////////////////////////////////////////////////////////

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  ///////////////////////////////////////////////////////////////////////////

  if (error) {
    return (
      <ErrorModal
        errorMessage={error}
        onClick={() => {
          clearError();
          auth.galleryLogout();
        }}
      />
    );
  }

  if (isLoading || !galleryData) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {error && <ErrorModal errorMessage={error} onClick={clearError} />}
      <div className="wedding-gallery" style={{ width: galleryWidth }}>
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
        <MasonryRow galleryData={galleryData} galleryWidth={galleryWidth} />
      </div>
    </>
  );
}

export default Gallery;
