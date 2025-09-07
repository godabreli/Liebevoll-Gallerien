import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import SortableList from '../GalleryItems/SortableList';
import ImageCard from '../GalleryItems/ImageCard';
import Button from '../../shared/form-elements/Button';
import LoadingSpinner from '../../shared/ui-elements/LoadingSpinner';

import './EditGallery.css';
import { API_URL } from '../../util/globalURLS';

const EditGallery = () => {
  const { galleryId } = useParams();
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const [galleryData, setGalleryData] = useState([]);
  const [oldImageFiles, setOldImageFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [markedForDeletion, setMarkedForDaletion] = useState();

  const filePickerRef = useRef();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const readData = async () => {
      const responseData = await sendRequest(
        `${API_URL}api/galleries/get-user-gallery/${galleryId}`,
        'GET',
        null,
        {
          Authorization: 'Bearer ' + auth.userToken,
        }
      );
      setGalleryData(responseData.data);
      setOldImageFiles(responseData.data.images);
      setImageFiles(responseData.data.images);
    };
    readData();
  }, [sendRequest, auth.userToken, galleryId]);

  ///////////////////////////////////////////////////////////////////

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  ///////////////////////////////////////////////////////////////

  const changeHandler = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    const readFiles = selectedFiles.map((file) => {
      return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          resolve({
            path: fileReader.result,
            name: file.name,
            file,
            altText: '',
          });
        };
        fileReader.readAsDataURL(file);
      });
    });
    const imageArray = await Promise.all(readFiles);
    setNewImageFiles((prev) => [...prev, imageArray]);
    setImageFiles((prevImages) => [...prevImages, ...imageArray]);
  };

  //////////////////////////////////////////////////////////////

  const deleteImageHandler = (item) => {
    setImageFiles(imageFiles.filter((el) => el !== item));
    if (newImageFiles.includes(item)) {
      setNewImageFiles(newImageFiles.filter((el) => el !== item));
    }
    if (oldImageFiles.includes(item)) {
      setImagesToDelete([...imagesToDelete, item]);
      setOldImageFiles(oldImageFiles.filter((el) => el !== item));
    }
  };

  ////////////////////////////////////////////////////////////////

  const updateGalleryHandler = async () => {
    const formData = new FormData();

    formData.append('name', galleryData.name);
    formData.append('downloadFunction', galleryData.downloadFunction);

    const altTexts = [];
    const imageNames = [];

    imageFiles.forEach((image) => {
      if (image.file) formData.append('images', image.file);
      altTexts.push(image.altText);
      imageNames.push(image.name);
    });

    formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    formData.append('oldImageFiles', JSON.stringify(oldImageFiles));
    formData.append('altTexts', JSON.stringify(altTexts));
    formData.append('imageNames', JSON.stringify(imageNames));

    const response = await sendRequest(
      `${API_URL}api/galleries/updateGallery/${galleryId}`,
      'PATCH',
      formData,
      {
        Authorization: 'Bearer ' + auth.userToken,
      }
    );

    if (response.status === 'success') {
      navigate(`/user-gallery/${galleryId}`);
    }
  };

  //////////////////////////////////////////////////////////////////////

  const renderItem = (item, i) => (
    <ImageCard
      imageFiles={imageFiles}
      imagePath={item.file ? item.path : API_URL + imageFiles[i].path}
      setImageFiles={setImageFiles}
      deleteImage={() => deleteImageHandler(item)}
      item={item}
      i={i}
      markedForDeletion={markedForDeletion}
      setMarkedForDeletion={setMarkedForDaletion}
    />
  );

  return (
    <>
      {error && (
        <ErrorModal errorMessage={error} onClick={clearError}></ErrorModal>
      )}
      <div className="edit-gallery-wrapper">
        {isLoading && <LoadingSpinner />}
        <div className="edit-gallery-buttons-wrapper">
          <Button
            size={window.innerWidth > 768 ? 'default' : 'small'}
            onClick={pickImageHandler}
          >
            ADD IMAGES
          </Button>
          <Button
            size={window.innerWidth > 768 ? 'default' : 'small'}
            onClick={updateGalleryHandler}
          >
            UPDATE GALLERY
          </Button>
        </div>
        <input
          type="file"
          ref={filePickerRef}
          multiple
          onChange={changeHandler}
          style={{ display: 'none' }}
          accept=".jpg,.png,.jpeg"
        />
        <div className="edit-gallery-items-wrapper">
          {imageFiles && (
            <SortableList
              array={imageFiles}
              renderItem={renderItem}
              setArray={setImageFiles}
              itemHeight={110}
              markedForDeletion={markedForDeletion}
              gap={6}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EditGallery;
