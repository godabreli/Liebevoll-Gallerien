import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from 'react';
import { AnimatePresence } from 'motion/react';

import { DownloadsContext } from './downloads-context';

import EmbedGalleryItem from './EmbedGalleryItem';
import EmbedSlider from './EmbedSlider';

const EmbedMasonryRow = (props) => {
  const galleryRowHeight = 500;
  const gap = 5;
  const imagesTopPositions = [];

  const { galleryData, galleryWidth } = props;

  const [galleryRows, setGalleryRows] = useState(null);
  const [galleryHeight, setGalleryHeight] = useState([]);
  const [openSlider, setOpenSlider] = useState(false);
  const [imageIndex, setImageIndex] = useState();

  const imagesWidthsArrayRef = useRef();
  const indexRef = useRef();
  const imageTopPositionRef = useRef();
  const galleryRowHeightRef = useRef(galleryRowHeight);

  const downloadVars = useContext(DownloadsContext);

  useEffect(() => {
    const calcImagePositions = () => {
      indexRef.current = 0;
      imageTopPositionRef.current = 0;

      if (galleryData && galleryWidth) {
        imagesWidthsArrayRef.current = galleryData.images.map((image) =>
          image.height > image.width
            ? galleryRowHeight / (image.height / image.width)
            : galleryRowHeight * (image.width / image.height)
        );

        const rows = [];

        if (galleryWidth < 768) {
          galleryData.images.forEach((image, i) => {
            const galleryRow = [];
            const height =
              image.height > image.width
                ? galleryWidth * (image.height / image.width)
                : galleryWidth / (image.width / image.height);

            galleryRow.push({
              index: i,
              width: galleryWidth,
              height,
              leftPosition: 0,
              topPosition: imageTopPositionRef.current,
            });

            rows.push(galleryRow);

            imageTopPositionRef.current += height + gap;
          });

          setGalleryRows(rows);
          setGalleryHeight(imageTopPositionRef.current);
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
              if (indexRef.current === imagesWidthsArrayRef.current.length)
                break;
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
              galleryRow.push({
                width: newWidth,
                height,
                index: indexRef.current,
                leftPosition,
                topPosition: imageTopPositionRef.current,
              });
              indexRef.current += 1;
            } else {
              if (widthcounter > galleryWidth) {
                indexRef.current = indexRef.current - imageCounter;
                galleryRowHeightRef.current = galleryRowHeight;
                const minus =
                  (widthcounter - galleryWidth - gap) / imageCounter;
                for (let i = 0; i < imageCounter; i++) {
                  const newWidth =
                    imagesWidthsArrayRef.current[indexRef.current] - minus;
                  galleryRow.push({
                    width: newWidth,
                    index: indexRef.current,
                    leftPosition,
                    topPosition: imageTopPositionRef.current,
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
                galleryRowHeightRef.current = galleryRowHeight;
                for (let i = 0; i < imageCounter; i++) {
                  const toAdd =
                    (galleryWidth - widthcounter + gap) / imageCounter;
                  const newWidth =
                    imagesWidthsArrayRef.current[indexRef.current] + toAdd;
                  galleryRow.push({
                    width: newWidth,
                    index: indexRef.current,
                    leftPosition,
                    topPosition: imageTopPositionRef.current,
                  });
                  leftPosition += newWidth + gap;
                  indexRef.current += 1;
                }
              }

              if (widthcounter < galleryWidth - 154) {
                indexRef.current = indexRef.current - imageCounter;
                galleryRowHeightRef.current = galleryRowHeight;
                for (let i = 0; i < imageCounter; i++) {
                  const newWidth =
                    imagesWidthsArrayRef.current[indexRef.current];
                  galleryRow.push({
                    width: newWidth,
                    index: indexRef.current,
                    leftPosition,
                    topPosition: imageTopPositionRef.current,
                  });
                  leftPosition += newWidth + gap;
                  indexRef.current += 1;
                }
              }
            }

            rows.push(galleryRow);

            imageTopPositionRef.current += galleryRowHeightRef.current + gap;
          }
          setGalleryRows(rows);
          setGalleryHeight(imageTopPositionRef.current - gap);
        }
      }
    };
    calcImagePositions();
  }, [galleryData, galleryWidth]);

  /////////////////////////////////////////////////////////////////////////////////

  if (galleryRows) {
    galleryRows.forEach((rows) => {
      rows.forEach((row) => {
        imagesTopPositions.push(row.topPosition);
      });
    });
  }

  //////////////////////////////////////////////////////////////////////////////

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

  //////////////////////////////////////////////////////////////////////////////////

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
    if (openSlider) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openSlider]);

  //////////////////////////////////////////////////////////////////////////////////

  const downloadCheckBoxHandler = useCallback(
    (index) => {
      downloadVars.setCheckBoxIsActive((prev) => {
        if (prev[index]) {
          return { ...prev, [index]: !prev[index] };
        } else {
          return { ...prev, [index]: true };
        }
      });

      downloadVars.setDownloads((prevDownloads) =>
        prevDownloads.includes(props.galleryData.images[index].path)
          ? prevDownloads.filter(
              (item) => item !== props.galleryData.images[index].path
            )
          : [...prevDownloads, props.galleryData.images[index].path]
      );
    },
    [downloadVars, props]
  );

  ////////////////////////////////////////////////////////////

  return (
    <>
      <AnimatePresence>
        {openSlider && (
          <EmbedSlider
            galleryData={galleryData}
            imageIndex={imageIndex}
            imagesTopPositions={imagesTopPositions}
            closeSlider={closeSliderHandler}
            galleryRowHeight={galleryRowHeightRef.current}
          />
        )}
      </AnimatePresence>

      <div
        style={{
          height: galleryHeight,
          width: galleryWidth,
          position: 'relative',
        }}
      >
        {galleryRows &&
          galleryRows.map((rows) =>
            rows.map((image) => (
              <EmbedGalleryItem
                className={`embedGalleryItemDiv ${
                  downloadVars.downloads.length > 0
                    ? 'embedGalleryItemDiv-downloadsActive'
                    : ''
                }`}
                checkBoxClassname={`embedDownloadCheckBox ${
                  downloadVars.checkBoxIsActive[image.index]
                    ? 'embedDownloadCheckBox-activ'
                    : downloadVars.downloads.length > 0
                    ? 'embedDownloadCheckBox-downloadsActiv'
                    : ''
                }`}
                checkBoxContent={
                  downloadVars.downloads.length > 0 &&
                  downloadVars.checkBoxIsActive[image.index]
                    ? '\u2714 '
                    : downloadVars.downloads.length > 0
                    ? ' '
                    : '\u2714'
                }
                itemStyle={{
                  position: 'absolute',
                  width: image.width,
                  height: image.height || galleryRowHeight,
                  top: image.topPosition,
                  left: image.leftPosition,
                }}
                imageSrc={`https://liebevollbelichtet.de/${
                  galleryData.images[image.index].path
                }`}
                alt={
                  galleryData.images[image.index].altText ||
                  'fotograf fotografiert modelle'
                }
                imageOnClick={() =>
                  downloadVars.downloads.length === 0
                    ? startSliderHandler(image.index)
                    : downloadCheckBoxHandler(image.index)
                }
                checkBoxOnClick={() => downloadCheckBoxHandler(image.index)}
                downloadFunction={galleryData.downloadFunction}
                imageLongPress={() => downloadCheckBoxHandler(image.index)}
              />
            ))
          )}
      </div>
    </>
  );
};

export default EmbedMasonryRow;
