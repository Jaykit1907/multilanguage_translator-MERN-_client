import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa"; // Speaker & Mic Icons
import History2 from "./History2.js";
import { TRANSLATE_URL, AUTHENTICATION_URL } from "./Url.js";
import Loading from "./Loading.js";
import Popup from "./Popup.js";
import LanguageList from "./LanguageList.js";
import SpeechPopup from "./SpeechPopup"; // Import the speech popup

const Home = () => {
  const [msg, setMsg] = useState("");
  const Navigate = useNavigate();
  const [selectedLanguage1, setSelectedLanguage1] = useState("en");
  const [selectedLanguage2, setSelectedLanguage2] = useState("hi");
  const [translatedText, setTranslatedText] = useState("");
  const [textToTranslate, setTextToTranslate] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupmsg, setShowPopupmsg] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setLocalEmail(localStorage.getItem("email"));
  }, []);

  const SPEECH_API_URL = "http://127.0.0.1:8000/api/speech/";

  // Translation Function
  const handleTranslate = async () => {
    if (!textToTranslate.trim()) {
      alert("Please enter text to translate.");
      return;
    }

    try {
      setShowPopup(true);
      setTranslatedText("");
      const GetVerify = await axios.get(AUTHENTICATION_URL, { withCredentials: true });

      if (GetVerify.status === 200 && GetVerify.data.authenticated) {
        const response = await axios.post(
          TRANSLATE_URL,
          { text: textToTranslate, language1: selectedLanguage1, language2: selectedLanguage2, email: localEmail },
          { withCredentials: true }
        );
        setShowPopup(false);
        setTranslatedText(response.data.translatedText);
      } else {
        alert("Please login to use the translation feature.");
        Navigate("/login");
      }
    } catch (error) {
      console.error("Error during authentication or translation:", error);
      setMsg("Error during authentication or translation");
      setShowPopupmsg(true);
      setTimeout(() => setShowPopupmsg(false), 2000);
      setShowPopup(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Authentication failed. Please log in again.");
        Navigate("/login");
      }
    }
  };

  // Text-to-Speech Function
  const handleSpeak = async (text, language) => {
    if (!text.trim()) {
      alert("No text to speak.");
      return;
    }
    try {
      const response = await axios.post(SPEECH_API_URL, { text, language }, { responseType: "blob" });
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error("Error generating speech:", error);
      alert("Failed to generate speech.");
    }
  };

  // Speech-to-Text Function
  const handleVoiceInput = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = selectedLanguage1; // Sets recognition language dynamically
    recognition.interimResults = false;
    recognition.continuous = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTextToTranslate(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <>
      {showPopup && <Loading message="Loading..." onClose={() => setShowPopup(false)} />}
      {showPopupmsg && <Popup message={msg} onClose={() => setShowPopupmsg(false)} />}
      {isListening && <SpeechPopup onClose={() => setIsListening(false)} />}

      <div className="history_visible">
        <History2 />
      </div>

      <section className="text_container">
        <div className="textarea_container1 textarea_con">
          <select onChange={(e) => setSelectedLanguage1(e.target.value)} value={selectedLanguage1}>
            {LanguageList.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          <div className="input-wrapper">
            <textarea value={textToTranslate} onChange={(e) => setTextToTranslate(e.target.value)} required></textarea>
            <FaMicrophone className="microphone-icon" onClick={handleVoiceInput} />
            <FaVolumeUp className="speaker-icon" onClick={() => handleSpeak(textToTranslate, selectedLanguage1)} />
          </div>
          <div className="btncontainer">
            <button onClick={handleTranslate} className="translatebtn">Translate</button>
          </div>
        </div>

        <div className="textarea_container1">
          <select onChange={(e) => setSelectedLanguage2(e.target.value)} value={selectedLanguage2}>
            {LanguageList.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          <div className="input-wrapper">
            <textarea value={translatedText} readOnly></textarea>
            <FaVolumeUp className="speaker-icon" onClick={() => handleSpeak(translatedText, selectedLanguage2)} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
