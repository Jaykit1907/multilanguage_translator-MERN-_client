import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Tesseract from 'tesseract.js';
import './Image.css';
import LanguageList from './LanguageList1';

const Image = () => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropperVisible, setIsCropperVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState('environment');
  const videoRef = useRef(null);
  const cropperRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: cameraMode } })
        .then((stream) => {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error('Error accessing webcam: ', err));
    }
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraActive, cameraMode]);

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL('image/png');
    setImage(imgData);
    setIsCropperVisible(true);
    setIsCameraActive(false);
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsCropperVisible(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropperInit = (cropperInstance) => {
    cropperRef.current = cropperInstance;
  };

  const cropImage = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedData = croppedCanvas.toDataURL('image/png');
        setCroppedImage(croppedData);
        setIsCropperVisible(false);
      } else {
        console.error('Failed to crop the image');
      }
    }
  };

  const extractTextFromImage = () => {
    if (!croppedImage) return;

    setIsLoading(true);

    Tesseract.recognize(croppedImage, selectedLanguage, {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setExtractedText(text);
        formatExtractedText(text);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error extracting text: ', err);
        setIsLoading(false);
      });
  };

  const formatExtractedText = (text) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/\n/g, '<br />');
    formatted = formatted.replace(/  /g, '&nbsp;&nbsp;');
    setFormattedText(formatted);
  };

  return (

    <div className="parent_container_image">
    <div className="image-cropper-container">
      <h2>Capture or Upload Image</h2>

      <div className="button-container">
        <button
          className="action-button"
          onClick={() => setIsCameraActive(true)}
        >
          Open Camera
        </button>

        <div className="file-upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
        </div>
      </div>

      {isCameraActive && (
        <div className="camera-container">
          <div className="camera-toggle-container">
            <label htmlFor="cameraMode">Camera Mode:</label>
            <select
              id="cameraMode"
              value={cameraMode}
              onChange={(e) => setCameraMode(e.target.value)}
            >
              <option value="environment">Back Camera</option>
              <option value="user">Front Camera</option>
            </select>
          </div>
          <video
            ref={videoRef}
            autoPlay
            width="400"
            height="300"
            className="video-feed"
          ></video>
          <button className="action-button" onClick={captureImage}>
            Capture Image
          </button>
        </div>
      )}

      {isCropperVisible && (
        <div className="cropper-container">
          <h3>Crop Image</h3>
          <Cropper
            src={image}
            ref={cropperRef}
            onInitialized={handleCropperInit}
            style={{ width: '100%', height: '400px' }}
            guides={false}
          />
          <button className="action-button" onClick={cropImage}>
            Crop Image
          </button>
        </div>
      )}

      {croppedImage && (
        <div className="cropped-image-container">
          <h3>Cropped Image:</h3>
          <img src={croppedImage} alt="Cropped" className="cropped-image" />
        </div>
      )}

      <div className="language-selector">
        <label htmlFor="language">Select Language:</label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {LanguageList.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="extract-text-container">
        <button className="action-button" onClick={extractTextFromImage}>
          Extract Text
        </button>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
        </div>
      )}

      {formattedText && (
        <div className="extracted-text-container">
          <h3>Extracted Text:</h3>
          <div
            className="extracted-text"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          ></div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Image;
