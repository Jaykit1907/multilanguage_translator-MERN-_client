import React, { useState, useEffect } from "react";
import "./Popup.css"; // Import the CSS file

const Popup = ({ message, onClose }) => {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     //onClose(); // Close the popup after 2 seconds
  //   }, 2000);

  //   return () => clearTimeout(timer); // Cleanup the timer on unmount
  // }, [onClose]);

  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;
