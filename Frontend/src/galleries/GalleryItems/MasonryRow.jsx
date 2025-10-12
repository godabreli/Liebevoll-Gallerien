import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { AnimatePresence } from 'motion/react';
import { AuthContext } from '../../../context/auth-context';

import GalleryItem from './GalleryItem';
import DownloadButtons from './DownloadButtons';
import ImageSlider from './ImageSlider';
import LoadingSpinner from '../../shared/ui-elements/LoadingSpinner';
import ErrorModal from '../../shared/ui-elements/ErrorModal';

import './MasonryRow.css';

import { API_URL } from '../../util/globalURLS';

const MasonryRow = ({ galleryData, galleryWidth }) => {
  const gap = 5;

  const imagesTopPositions = [];

  const [checkBoxIsActiv, setCheckBoxIsActiv] = useState({});
  const [downloads, setDownloads] = useState([]);
  const [openSlider, setOpenSlider] = useState(false);
  const [imageIndex, setImageIndex] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [galleryRows, setGalleryRows] = useState();
  const [galleryWrapperHight, setGalleryWrapperHight] = useState(0);

  const auth = useContext(AuthContext);

  const activeHttpRequests = useRef([]);
  const galleryRowHeightRef = useRef(300);
  const imageTopPositionRef = useRef(0);
  const indexRef = useRef();
  const imagesWidthsArrayRef = useRef();

  const downloadAuth = useMemo(() => {
    if (auth.userToken) {
      return auth.userToken;
    } else {
      return auth.galleryToken;
    }
  }, [auth.galleryToken, auth.userToken]);

  const authType = useMemo(() => {
    if (auth.userToken) {
      return 'user';
    } else {
      return 'gallery';
    }
  }, [auth.userToken]);

  // Durch imagesWidthArrey gehen und Bilder Zahl für die Reihen und lange Seiten und Positionen Berechnen
  useEffect(() => {
    const calcImagePositions = () => {
      indexRef.current = 0;
      imageTopPositionRef.current = 0;

      // Die Breite von den Bildern setzen

      imagesWidthsArrayRef.current = galleryData.images.map((image) =>
        image.height > image.width
          ? galleryRowHeightRef.current / (image.height / image.width)
          : galleryRowHeightRef.current * (image.width / image.height)
      );

      const galleryRowsArray = [];

      if (window.innerWidth < 500) {
        const newWidth = galleryWidth;
        let imageTopPosition = 0;
        galleryData.images.forEach((image, i) => {
          const galleryRow = [];
          const height =
            image.height > image.width
              ? newWidth * (image.height / image.width)
              : newWidth / (image.width / image.height);
          galleryRow.push({
            index: i,
            width: newWidth,
            height,
            leftPosition: 0,
          });

          galleryRowsArray.push({
            imageTopPosition,
            galleryRow,
          });

          imageTopPosition += height + gap;
        });
        setGalleryWrapperHight(imageTopPosition);
      } else {
        while (indexRef.current < imagesWidthsArrayRef.current.length) {
          let widthcounter = 0;
          let imageCounter = 0;
          let leftPosition = 0;
          const galleryRow = [];

          // Bilder Anzahl für eine Reihe berechnen

          while (widthcounter < galleryWidth - 154) {
            widthcounter +=
              imagesWidthsArrayRef.current[indexRef.current] + gap;
            imageCounter += 1;
            indexRef.current += 1;
            if (indexRef.current === imagesWidthsArrayRef.current.length) break;
          }

          // Die langen Seiten berechnen
          if (imageCounter === 1 && galleryWidth < 500) {
            indexRef.current -= 1;
            const newWidth = galleryWidth;
            const height =
              galleryData.images[indexRef.current].height >
              galleryData.images[indexRef.current].width
                ? newWidth *
                  (galleryData.images[indexRef.current].height /
                    galleryData.images[indexRef.current].width)
                : newWidth /
                  (galleryData.images[indexRef.current].width /
                    galleryData.images[indexRef.current].height);
            // galleryRowHeightRef.current = height;
            galleryRow.push({
              width: newWidth,
              height,
              index: indexRef.current,
              leftPosition,
            });
            indexRef.current += 1;
          } else {
            if (widthcounter > galleryWidth) {
              indexRef.current = indexRef.current - imageCounter;
              galleryRowHeightRef.current = 300;
              const minus = (widthcounter - galleryWidth - gap) / imageCounter;
              for (let i = 0; i < imageCounter; i++) {
                const newWidth =
                  imagesWidthsArrayRef.current[indexRef.current] - minus;
                galleryRow.push({
                  width: newWidth,
                  index: indexRef.current,
                  leftPosition,
                });
                leftPosition += newWidth + gap;
                indexRef.current += 1;
              }
            }

            if (
              widthcounter > galleryWidth - 154 &&
              widthcounter < galleryWidth
            ) {
              indexRef.current = indexRef.current - imageCounter;
              galleryRowHeightRef.current = 300;
              for (let i = 0; i < imageCounter; i++) {
                const toAdd =
                  (galleryWidth - widthcounter + gap) / imageCounter;
                const newWidth =
                  imagesWidthsArrayRef.current[indexRef.current] + toAdd;
                galleryRow.push({
                  width: newWidth,
                  index: indexRef.current,
                  leftPosition,
                });
                leftPosition += newWidth + gap;
                indexRef.current += 1;
              }
            }

            if (widthcounter < galleryWidth - 154) {
              indexRef.current = indexRef.current - imageCounter;
              galleryRowHeightRef.current = 300;
              for (let i = 0; i < imageCounter; i++) {
                const newWidth = imagesWidthsArrayRef.current[indexRef.current];
                galleryRow.push({
                  width: newWidth,
                  index: indexRef.current,
                  leftPosition,
                });
                leftPosition += newWidth + gap;
                indexRef.current += 1;
              }
            }
          }

          galleryRowsArray.push({
            imageTopPosition: imageTopPositionRef.current,
            galleryRow,
          });
          imageTopPositionRef.current += galleryRowHeightRef.current + gap;
        }
      }

      setGalleryRows(galleryRowsArray);
    };
    calcImagePositions();
  }, [galleryData, galleryWidth]);

  // Top positionrn von Bildern in einem Arrey sammeln, um beim sleiden der Bilder Window zum Richtign position zu scrollen
  if (galleryRows) {
    galleryRows.forEach((row) => {
      row.galleryRow.forEach(() => {
        imagesTopPositions.push(row.imageTopPosition);
      });
    });
  }

  const downloadCheckboxHandler = useCallback(
    (index) => {
      if (checkBoxIsActiv[index]) {
        setCheckBoxIsActiv({
          ...checkBoxIsActiv,
          [index]: !checkBoxIsActiv[index],
        });
      } else {
        setCheckBoxIsActiv({ ...checkBoxIsActiv, [index]: true });
      }

      setDownloads((prevDownloads) =>
        prevDownloads.includes(galleryData.images[index].path)
          ? prevDownloads.filter(
              (item) => item !== galleryData.images[index].path
            )
          : [...prevDownloads, galleryData.images[index].path]
      );
    },
    [checkBoxIsActiv, galleryData.images]
  );

  const downloadHandler = async (paths) => {
    const imagePaths = paths.map((path) => {
      const parts = path.split('/');
      parts.splice(2, 1);
      return parts.join('/');
    });

    try {
      setLoading(true);
      if (!Array.isArray(activeHttpRequests.current)) {
        activeHttpRequests.current = [];
      }
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);

      const response = await fetch(
        API_URL + 'api/galleries/downloads/download-images',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + downloadAuth,
          },
          body: JSON.stringify({
            imagePaths,
            galleryId: galleryData.Id,
            authType,
          }),
          signal: httpAbortController.signal,
        }
      );

      activeHttpRequests.current = activeHttpRequests.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortController
      );

      if (!response.ok) {
        setLoading(false);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const downloadAllHandler = () => {
    const allImagesPaths = galleryData.images.map((image) => image.path);
    downloadHandler(allImagesPaths);
  };

  //////////////////////////////////////////////////////

  const openFullscreen = async () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      await el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      // Safari
      await el.webkitRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // Safari
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      // IE11
      document.msExitFullscreen();
    }
  };

  ////////////////////////////////////////////////////////////

  const startSliderHandler = useCallback((index) => {
    setImageIndex(index);
    setOpenSlider(true);

    if (window.innerWidth < 768) {
      openFullscreen();
    }
  }, []);

  const closeSliderHandler = (index) => {
    window.scrollTo(0, imagesTopPositions[index]);
    setOpenSlider(false);
    if (document.fullscreenElement) {
      exitFullscreen();
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (activeHttpRequests.current) {
      return () => {
        activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
      };
    }
  }, []);

  // Scrollbar deactivieren, wenn Slider geöfnet ist

  useEffect(() => {
    if (openSlider) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openSlider]);

  if (!galleryRows) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && (
        <ErrorModal errorMessage={error} onClick={() => setError(null)} />
      )}

      <div className="masonryRow" style={{ width: galleryWidth }}>
        <AnimatePresence>
          {openSlider && (
            <ImageSlider
              galleryData={galleryData}
              imageIndex={imageIndex}
              imagesTopPositions={imagesTopPositions}
              closeSlider={closeSliderHandler}
              galleryRowHeight={galleryRowHeightRef.current}
            />
          )}
        </AnimatePresence>
        {galleryData.downloadFunction && (
          <DownloadButtons
            downloadsArrey={downloads}
            downloadSelection={() => downloadHandler(downloads)}
            downloadAll={downloadAllHandler}
          />
        )}
        <div
          className="gallery-wrapper"
          style={{
            width: galleryWidth,
            height:
              window.innerWidth < 500
                ? galleryWrapperHight
                : galleryRowHeightRef.current * galleryRows.length +
                  (galleryRows.length - 1) * gap,
          }}
        >
          {galleryRows.map((row) =>
            row.galleryRow.map((image) => (
              <GalleryItem
                key={image.index}
                index={image.index}
                downloadFunction={galleryData.downloadFunction}
                topPosition={row.imageTopPosition}
                galleryItemClassName={
                  downloads.length > 0 ? 'downloadsActive' : 'default'
                }
                src={API_URL + galleryData.images[image.index].path}
                alt={galleryData.images[image.index].altText || 'Wedding image'}
                imageOnClick={
                  downloads.length > 0
                    ? () => downloadCheckboxHandler(image.index)
                    : () => startSliderHandler(image.index)
                }
                imageLongPress={() => downloadCheckboxHandler(image.index)}
                itemStyle={{
                  height: image.height || galleryRowHeightRef.current,
                  width: image.width,
                  top: row.imageTopPosition,
                  left: image.leftPosition,
                }}
                checkBoxHandler={() => {
                  downloadCheckboxHandler(image.index);
                }}
                checkBoxClassname={
                  checkBoxIsActiv[image.index]
                    ? 'activ'
                    : downloads.length > 0
                    ? 'downloadsActiv'
                    : 'default'
                }
                checkBoxContent={
                  downloads.length > 0 && checkBoxIsActiv[image.index]
                    ? '\u2714 '
                    : downloads.length > 0
                    ? ' '
                    : '\u2714'
                }
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MasonryRow;
