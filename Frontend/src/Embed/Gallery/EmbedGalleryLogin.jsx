import React, { useState } from 'react';

import { API_URL } from '../../util/globalURLS';

const EmbedGalleryLogin = (props) => {
  const [galleryName, setGalleryName] = useState('');
  const [galleryPassword, setGalleryPassword] = useState('');
  const [galleryNameOnBlur, setGalleryNameOnBlur] = useState(false);
  const [galleryPasswordOnBlur, setGalleryPasswordOnBlur] = useState(false);
  const [error, setError] = useState(null);

  const submitFormHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        'https://liebevollbelichtet.de/api/galleries/login',
        {
          method: 'POST',
          body: JSON.stringify({
            name: galleryName,
            password: galleryPassword,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await res.json();

      if (data.status === 'error') {
        setError(data.message);
      }
      if (data.status === 'success') {
        setError(null);
        setGalleryName('');
        setGalleryPassword('');
        setGalleryNameOnBlur(false);
        setGalleryPasswordOnBlur(false);
        props.logIn(data.data.galleryId, data.data.token);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="EmbedGalleryLoginWrapper">
      <div className="embedGalleryLoginCard">
        <form className="embedGalleryLoginForm" onSubmit={submitFormHandler}>
          <label htmlFor="galleryName">Gallery Name:</label>
          <input
            className={`embedGalleryLoginInput ${
              galleryNameOnBlur && galleryName === ''
                ? 'embedGalleryLoginInput--red'
                : ''
            }`}
            onBlur={() => setGalleryNameOnBlur(true)}
            id="galleryName"
            type="text"
            name="galleryName"
            value={galleryName}
            onChange={(e) => setGalleryName(e.target.value)}
          ></input>
          <label htmlFor="galleryPassword">Password:</label>
          <input
            className={`embedGalleryLoginInput ${
              galleryPasswordOnBlur && galleryPassword === ''
                ? 'embedGalleryLoginInput--red'
                : ''
            }`}
            onBlur={() => setGalleryPasswordOnBlur(true)}
            id="galleryPassword"
            type="password"
            value={galleryPassword}
            onChange={(e) => setGalleryPassword(e.target.value)}
            style={{ marginBottom: error ? '5px' : '20px' }}
          ></input>
          {error && (
            <p
              style={{ color: 'red', marginBottom: '20px', fontSize: '1.2rem' }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={galleryName === '' || galleryPassword === ''}
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmbedGalleryLogin;
