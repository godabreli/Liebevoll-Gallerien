import React, { useContext, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../../context/auth-context';

import './Galleries.css';
import Card from '../../shared/ui-elements/Card';
import LoadingSpinner from '../../shared/ui-elements/LoadingSpinner';
import Button from '../../shared/form-elements/Button';
import { Link } from 'react-router-dom';
import { API_URL } from '../../util/globalURLS';

function Galleries() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [galleries, setGalleries] = useState();
  const [warning, setWorning] = useState({});
  const [deletGallerySpinner, setDeleteGallerySpinner] = useState({});
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          API_URL + 'api/galleries',
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.userToken,
          }
        );

        if (responseData.status === 'success') {
          setGalleries(responseData.data);
        }
      } catch (err) {
        console.error(`Problems by fetching data: ${err}`);
      }
    };
    fetchData();
  }, [auth.userToken, sendRequest]);

  const deleteGalleryHandler = async (galleryId) => {
    setDeleteGallerySpinner((prevState) => ({
      ...prevState,
      [galleryId]: true,
    }));
    try {
      await fetch(`${API_URL}api/galleries/deleteGallerie/${galleryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + auth.userToken,
        },
      });
      setGalleries((prevGalleries) =>
        prevGalleries.filter((gallery) => gallery.id !== galleryId)
      );

      setDeleteGallerySpinner((prevState) => ({
        ...prevState,
        [galleryId]: false,
      }));
    } catch (err) {
      console.error(`Error deleting gallery: ${err}`);
    }
  };

  if (!galleries) {
    return <LoadingSpinner />;
  }

  if (galleries.length === 0) {
    return (
      <div className="no-galleries">
        No galleries found....
        <span className="space">
          <Link to={'/create-gallery'}>Create one</Link>
        </span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta
          http-equiv="Content-Security-Policy"
          content="
            default-src 'self';
            script-src 'self';
            style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
            img-src 'self' data:;
            font-src 'self' https://fonts.gstatic.com;
            connect-src 'self' https://www.liebevollbelichtet.de;
            object-src 'none';
          "
        />
      </Helmet>
      <AnimatePresence>
        {error && (
          <ErrorModal errorMessage={error} onClick={clearError}></ErrorModal>
        )}
      </AnimatePresence>
      <div className="galleries-wrapper">
        {isLoading && <LoadingSpinner />}
        {galleries &&
          galleries.map((gallery, i) => {
            return (
              <Card key={i} className="gallery-card">
                {deletGallerySpinner[gallery.id] && (
                  <LoadingSpinner position="absolute" />
                )}

                <div className="image-title-buttons-wrapper">
                  <img
                    className="galleries-image"
                    src={`${API_URL}${gallery.images[0].path}`}
                    alt={gallery.images[0].altText || 'Wedding emage'}
                  />
                  <div className="title-buttons-wrapper">
                    <div className="gallery-title">{gallery.name}</div>
                    <div className="buttons-wrapper">
                      <Button
                        to={`/user-gallery/${gallery.id}`}
                        size={window.innerWidth > 768 ? 'small' : 'very-small'}
                        ok
                      >
                        OPEN
                      </Button>
                      <Button
                        to={`/edit-gallery/${gallery.id}`}
                        size={window.innerWidth > 768 ? 'small' : 'very-small'}
                        ok
                      >
                        EDIT
                      </Button>
                      <Button
                        size={window.innerWidth > 768 ? 'small' : 'very-small'}
                        danger
                        onClick={() => {
                          setWorning((prevState) => ({
                            ...prevState,
                            [gallery.id]: true,
                          }));
                        }}
                      >
                        DELETE
                      </Button>
                    </div>
                  </div>
                </div>
                {warning[gallery.id] && (
                  <div className="warning">
                    <p className="warning-text">
                      {window.innerWidth > 768
                        ? 'Flagged for deletion'
                        : 'DELETE'}
                    </p>
                    <div className="warning-buttons-div">
                      <Button
                        ok
                        size={window.innerWidth > 768 ? 'small' : 'very-small'}
                        onClick={() => {
                          setWorning((prevState) => ({
                            ...prevState,
                            [gallery.id]: false,
                          }));
                        }}
                      >
                        CANCEL
                      </Button>
                      <Button
                        onClick={() => {
                          deleteGalleryHandler(gallery.id);
                        }}
                        danger
                        size={window.innerWidth > 768 ? 'small' : 'very-small'}
                      >
                        DELETE
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
      </div>
    </>
  );
}

export default Galleries;
