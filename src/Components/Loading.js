import React, { useState, useEffect } from "react";
import "./Loading.css"; // Import the CSS file

const Loading = ({ message, onClose }) => {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onClose(); // Close the popup after 2 seconds
  //   }, 2000);

  //   return () => clearTimeout(timer); // Cleanup the timer on unmount
  // }, [onClose]);

  return (
    <div className="popupmsg">
      <div className="popup-contentmsg">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loading;
