import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import { useForm } from '../../shared/hooks/form-hook';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRED } from '../../util/validators';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../../context/auth-context';

import Card from '../../shared/ui-elements/Card';
import Input from '../../shared/form-elements/Input';
import ErrorModal from '../../shared/ui-elements/ErrorModal';
import Button from '../../shared/form-elements/Button';
import LoadingSpinner from '../../shared/ui-elements/LoadingSpinner';
import SortableList from '../GalleryItems/SortableList';
import ImageCard from '../GalleryItems/ImageCard';

import './CreateGallery.css';

import { API_URL } from '../../util/globalURLS';

function CreateGallery() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState([]);
  const [openingImages, setOpeningImages] = useState(false);
  const [markedForDeletion, setMarkedForDeletion] = useState();
  const [protectedGallery, setProtectedGallery] = useState(false);
  const [downloadFunction, setDownloadFunction] = useState(false);
  const [freeGalleryName, setFreeGalleryName] = useState('');
  const [freeGalleryInputTouched, setFreeGalleryInputTouched] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const filePickerRef = useRef();

  const [formState, inputHandler] = useForm(
    {
      name: { value: '', isValid: false },
      password: { value: '', isValid: false },
      passwordConfirm: { value: '', isValid: false },
    },
    false
  );

  /////////////////////////////////////////////////////////////

  const changeHandler = async (e) => {
    setOpeningImages(true);
    const selectedFiles = Array.from(e.target.files);

    const readFiles = selectedFiles.map((file) => {
      return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          resolve({ url: fileReader.result, file, altText: '' });
        };
        fileReader.readAsDataURL(file);
      });
    });
    const imageArray = await Promise.all(readFiles);
    setImageFiles((prevImages) => [...prevImages, ...imageArray]);
    setOpeningImages(false);
  };

  //////////////////////////////////////////////////////////////////////

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  /////////////////////////////////////////////////////////////////////////////

  const submitHandler = async (e) => {
    e.preventDefault();
    const name = protectedGallery
      ? formState.inputs.name.value
      : freeGalleryName;

    let checkedName;

    try {
      checkedName = await sendRequest(
        API_URL + 'api/galleries/checkGalleryName',
        'POST',
        JSON.stringify({
          name,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.userToken,
        }
      );
    } catch (err) {
      console.log('error by checking the Name', err);
    }

    if (checkedName && checkedName.status === 'available') {
      try {
        const formData = new FormData();

        formData.append('name', name);

        formData.append('isProtected', protectedGallery);
        formData.append('downloadFunction', downloadFunction);
        if (protectedGallery) {
          formData.append('password', formState.inputs.password.value);
          formData.append(
            'passwordConfirm',
            formState.inputs.passwordConfirm.value
          );
        }
        imageFiles.forEach((image) => {
          formData.append('images', image.file);
          formData.append('altTexts', image.altText);
        });

        const responseData = await sendRequest(
          API_URL + 'api/galleries/createGallerie',
          'POST',
          formData,
          {
            Authorization: 'Bearer ' + auth.userToken,
          }
        );

        if (responseData.status === 'success') {
          navigate('/galleries');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  //////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////

  const renderItem = (item, i) => (
    <ImageCard
      imageFiles={imageFiles}
      imagePath={imageFiles[i].url}
      setImageFiles={setImageFiles}
      item={item}
      i={i}
      markedForDeletion={markedForDeletion}
      setMarkedForDeletion={setMarkedForDeletion}
      deleteImage={() => setImageFiles(imageFiles.filter((el) => el !== item))}
    />
  );

  //////////////////////////////////////////////////////////////////////

  return (
    <div className="create-gallery-wrapper">
      <AnimatePresence>
        {error && (
          <ErrorModal errorMessage={error} onClick={clearError}></ErrorModal>
        )}
      </AnimatePresence>
      {isLoading && <LoadingSpinner />}
      <Card className="create-gallery-form-card">
        <span className="create-gallery-title">CREATE GALERY</span>
        <div className="chekboxes-wrapper">
          <div className="protected-or-not-wrapper">
            <div
              className="checkbox"
              onClick={() => setProtectedGallery(!protectedGallery)}
            >
              {protectedGallery ? '\u2714 ' : ''}
            </div>
            <span className="checkbox-label">Protected</span>
          </div>
          <div className="protected-or-not-wrapper">
            <div
              className="checkbox"
              onClick={() => setDownloadFunction(!downloadFunction)}
            >
              {downloadFunction ? '\u2714 ' : ''}
            </div>
            <span className="checkbox-label">Download function</span>
          </div>
        </div>
        {!protectedGallery && (
          <form className="create-free-gallery-form" onSubmit={submitHandler}>
            <div className="free-gallery-name-input-wrapper">
              <p
                className={`free-gallery-name-input-label ${
                  freeGalleryInputTouched && freeGalleryName === ''
                    ? 'free-gallery-name-input-label-error'
                    : ''
                }`}
              >
                Gallery name:
              </p>
              <div className="free-gallery-name-input-and-button-wrapper">
                <input
                  type="text"
                  value={freeGalleryName}
                  onBlur={() => setFreeGalleryInputTouched(true)}
                  onChange={(e) => setFreeGalleryName(e.target.value)}
                  className={`free-gallery-name-input ${
                    freeGalleryInputTouched && freeGalleryName === ''
                      ? 'free-gallery-name-input-error'
                      : ''
                  }`}
                />
                <Button
                  type="submit"
                  disabled={imageFiles.length === 0 || freeGalleryName === ''}
                >
                  CREATE
                </Button>
              </div>
              {freeGalleryInputTouched && freeGalleryName === '' && (
                <p className="free-gallery-name-input-error-text">
                  Please enter the gallery name!
                </p>
              )}
            </div>
          </form>
        )}
        {protectedGallery && (
          <form
            className="create-protected-gallery-form"
            onSubmit={submitHandler}
          >
            <Input
              element="input"
              id="name"
              type="text"
              label="Gallery name:"
              onInput={inputHandler}
              validators={VALIDATOR_REQUIRED()}
              errorText={'Please provide the gallery name.'}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Password:"
              onInput={inputHandler}
              validators={VALIDATOR_MINLENGTH(8)}
              errorText={'Password mast have min length of 8.'}
            />
            <Input
              element="input"
              id="passwordConfirm"
              type="password"
              label="Password confirm:"
              onInput={inputHandler}
              validators={VALIDATOR_REQUIRED()}
              errorText={'Please confirm your password.'}
            />
            <Button
              disabled={!(imageFiles.length > 0 && formState.formIsValid)}
              type="submit"
            >
              CREATE
            </Button>
          </form>
        )}
        <input
          ref={filePickerRef}
          type="file"
          multiple
          onChange={changeHandler}
          style={{ display: 'none' }}
          accept=".jpg,.png,.jpeg"
        />
        <Button size="small" onClick={pickImageHandler}>
          {imageFiles.length > 0 ? 'ADD IMAGES' : 'SELECT IMAGES'}
        </Button>
      </Card>
      <div className="image-preview">
        {openingImages && <LoadingSpinner position="top" />}
        {imageFiles && (
          <SortableList
            array={imageFiles}
            renderItem={renderItem}
            setArray={setImageFiles}
            itemHeight={100}
            markedForDeletion={markedForDeletion}
            gap={6}
          />
        )}
      </div>
    </div>
  );
}

export default CreateGallery;
