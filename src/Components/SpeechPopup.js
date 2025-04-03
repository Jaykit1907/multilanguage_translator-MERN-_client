import React from "react";
import { FaMicrophone } from "react-icons/fa";
import "./SpeechPopup.css"; // Import the CSS file for styling

const SpeechPopup = ({ onClose }) => {
  return (
    <div className="speech-popup">
      <div className="speech-popup-content">
        <FaMicrophone className="popup-mic-icon" />
        <p>Listening... Speak Now!</p>
      </div>
    </div>
  );
};

export default SpeechPopup;
