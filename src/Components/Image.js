import React, { useState } from "react";
import Tesseract from "tesseract.js";
import Cropper from "react-easy-crop";
import getCroppedImg from "./Crop"; // Import the getCroppedImg function
import "./Image.css"; // Import the external CSS

const Image = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("eng"); // Default to English
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  // Handle image upload from file system or capture from camera
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a temporary URL for the uploaded file
    }
  };

  // Handle camera capture using MediaDevices API
  const handleCaptureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      video.onloadeddata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to image URL
        const capturedImage = canvas.toDataURL("image/png");
        setImage(capturedImage);
        stream.getTracks().forEach(track => track.stop()); // Stop the camera after capture
      };
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  // Handle crop completion
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Handle crop button click
  const handleCrop = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImageUrl); // Set the cropped image URL
    } catch (error) {
      console.error("Error cropping the image:", error);
    }
  };

  // Extract text using Tesseract.js
  const extractText = () => {
    if (croppedImage) {
      setLoading(true);
      Tesseract.recognize(croppedImage, language, {
        logger: (info) => console.log(info), // Logs progress
      })
        .then(({ data: { text } }) => {
          setText(text);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="image-container">
      <h2 className="title">Multi-Language OCR with Image Cropping</h2>

      <div className="file-input-wrapper">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="file-input-label">
          Choose File
        </label>
      </div>

      {/* Camera capture button */}
      <button onClick={handleCaptureImage} className="capture-button">
        Capture Image
      </button>

      <div className="language-selection">
        <label>Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-dropdown"
        >
          <option value="eng">English</option>
          <option value="hin">Hindi</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          <option value="ara">Arabic</option>
        </select>
      </div>

      {/* Show the image cropper if an image is uploaded */}
      {image && !croppedImage && (
        <div className="cropper-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3} // Aspect ratio for cropping (adjust as needed)
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete} // Capture the cropped area
          />
        </div>
      )}

      {/* Button to trigger the crop */}
      {image && !croppedImage && (
        <button onClick={handleCrop} className="crop-button">
          Crop Image
        </button>
      )}

      {/* Show the cropped image after cropping */}
      {croppedImage && (
        <img
          src={croppedImage}
          alt="Cropped"
          className="cropped-image"
        />
      )}

      {/* Button to trigger text extraction */}
      <div>
        <button
          onClick={extractText}
          disabled={!croppedImage || loading}
          className="extract-button"
        >
          {loading ? "Processing..." : "Extract Text"}
        </button>
      </div>

      {/* Display the extracted text */}
      {text && (
        <div className="text-container">
          <h3 className="text-title">Extracted Text:</h3>
          <p className="extracted-text">{text}</p>
        </div>
      )}
    </div>
  );
};

export default Image;