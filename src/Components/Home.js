import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import {useNavigate } from "react-router-dom";
import History2 from "./History2.js";
import { HOME_URL,TRANSLATE_URL,LOGOUT_URL,AUTHENTICATION_URL } from "./Url.js";
import { useLocation } from "react-router-dom";
import Home_container from "./Home_container.js";
import Loading from "./Loading.js";
import Popup from "./Popup.js";

import LanguageList from "./LanguageList.js";

const Home = () => {
  const [show, setShow] = useState(true);
  const [msg, setMsg] = useState("");
  const [showlogin, setShowlogin] = useState(true);
  const Navigate = useNavigate();
  const [selectedLanguage1, setSelectedLanguage1] = useState("en");
  const [selectedLanguage2, setSelectedLanguage2] = useState("hi");
  const [translatedText, setTranslatedText] = useState("");
  const [textToTranslate, setTextToTranslate] = useState("");
  const location = useLocation();
  const [localEmail, setLocalEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupmsg,setShowPopupmsg]=useState(false);


useEffect(()=>{

  setLocalEmail(localStorage.getItem("email"));
  console.log("this is email from home page:",localEmail);

});

const handleTranslate = async () => {
  try {
    setLocalEmail(localStorage.getItem("email"));
    setShowPopup(true);
    setTranslatedText("");
  //  setLocalEmail(email)
    console.log("This is email:", localEmail); // Debugging
    // Use localEmail for the translation request
    const GetVerify = await axios.get(AUTHENTICATION_URL, { withCredentials: true });

    if (GetVerify.status === 200 && GetVerify.data.authenticated) {
      const response = await axios.post(
        TRANSLATE_URL,
        {
          text: textToTranslate,
          language1: selectedLanguage1,
          language2: selectedLanguage2,
          email: localEmail, // Use the locally stored email
        },
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
    setTimeout(() => {
      setShowPopupmsg(false);
     // window.location.reload();
    }, 2000);
    setShowPopup(false);
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert("Authentication failed. Please log in again.");
      
      Navigate("/login");
    }
  }
};

  const handleSpeak = () => {
    if (!textToTranslate.trim()) {
      alert("Please enter text to speak.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToTranslate);
    utterance.lang = selectedLanguage1;
    speechSynthesis.speak(utterance);
  };

  const handleLanguageChange1 = (event) => {
    setSelectedLanguage1(event.target.value);
  };

  const handleLanguageChange2 = (event) => {
    console.log(event.target.value);
    setSelectedLanguage2(event.target.value);
  };

  const handleTextChange = (event) => {
    setTextToTranslate(event.target.value);
  };



  
   

  
  return (

    
    <>

{showPopup && (
        <Loading
          message="Loading..."
          onClose={() => setShowPopup(false)}
        />
      )}

{showPopupmsg && (
        <Popup
          message={msg}
          onClose={() => setShowPopup(false)}
        />
      )}
  
  

    <div className="history_visible">
      <History2/>
      </div>


      {show && (
        <section className="text_container">

          
          <div className="textarea_container1 textarea_con">
            <select onChange={handleLanguageChange1} value={selectedLanguage1}>
              {LanguageList.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <textarea
              value={textToTranslate}
              onChange={handleTextChange}
              required
            ></textarea>

            <div className="btncontainer">
              <button onClick={handleTranslate} className="translatebtn">
                Translate
              </button>
              <button className="translatebtn" onClick={handleSpeak}>
                Speak
              </button>
            </div>
          </div>

          <div className="textarea_container1">
            <select onChange={handleLanguageChange2} value={selectedLanguage2}>
              {LanguageList.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <textarea value={translatedText} readOnly />
            <div className="btncontainer1">
              <button onClick={handleTranslate} className="translatebtn">
                Translate
              </button>
              <button className="translatebtn" onClick={handleSpeak}>
                Speak
              </button>
            </div>
          </div>
        </section>
      )}




    </>
  );
};

export default Home;
