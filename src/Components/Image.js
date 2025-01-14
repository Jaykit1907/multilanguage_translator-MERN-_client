import React, { useState, useRef } from "react";
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
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Toggle camera view
  const videoRef = useRef(null); // Ref to access the video element
  const canvasRef = useRef(null); // Ref to access the canvas element

  // Handle image upload from file system
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a temporary URL for the uploaded file
    }
  };

  // Handle opening the camera
  const openCamera = async () => {
  try {
    console.log("Opening camera...");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("Camera stream acquired:", stream);

    setIsCameraOpen(true);
    if (videoRef.current) {
      videoRef.current.srcObject = stream; // Set the camera stream
      videoRef.current.play();
      console.log("Video element source set successfully");
    }
  } catch (error) {
    console.error("Error accessing the camera:", error);
    alert("Unable to access camera. Please check permissions.");
  }
};

  // Event handler for when video metadata is loaded
  const onVideoLoaded = () => {
    console.log("Video loaded metadata.");
    if (videoRef.current) {
      videoRef.current.play(); // Ensure the video starts playing
    }
  };

  // Capture image from the live video feed
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL("image/png");
      setImage(capturedImage);
      setIsCameraOpen(false); // Close the camera after capturing the photo
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // Stop the camera
        console.log("Camera stream stopped.");
      }
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
      {!isCameraOpen && (
        <button onClick={openCamera} className="capture-button">
          Open Camera
        </button>
      )}

      {isCameraOpen && (
        <div className="camera-container">
          <video
            ref={videoRef}
            className="camera-view"
            autoPlay
            playsInline
            onLoadedMetadata={onVideoLoaded} // Ensure video starts after metadata is loaded
            style={{ width: "100%", height: "auto", borderRadius: "10px" }} // Ensure the video has a width and height
          />
          <button onClick={captureImage} className="capture-button">
            Capture Photo
          </button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}

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
          <pre className="extracted-text">{text}</pre>
        </div>
      )}
    </div>
  );
};

export default Image;
