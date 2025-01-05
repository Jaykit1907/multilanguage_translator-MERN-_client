import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import {useNavigate } from "react-router-dom";
import Login from "./Login.js";
import { HOME_URL,TRANSLATE_URL,LOGOUT_URL } from "./Url.js";
import { useLocation } from "react-router-dom";

import LanguageList from "./LanguageList.js";

const Home = () => {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [showlogin, setShowlogin] = useState(true);
  const Navigate = useNavigate();
  const [selectedLanguage1, setSelectedLanguage1] = useState("en");
  const [selectedLanguage2, setSelectedLanguage2] = useState("hi");
  const [translatedText, setTranslatedText] = useState("");
  const [textToTranslate, setTextToTranslate] = useState("");
  const location = useLocation();
//   const [loading, setLoading] = useState(false);



useEffect(() => {
  if (location.state?.loggedIn) {
    console.log("this is location running");
    setShow(true);
    setShowlogin(false);
  }
}, [location.state]);


  useEffect(() => {
    console.log("loading...home page.......");
    const fetchHome = async () => {
      const Response = await axios.get(HOME_URL, {
        withCredentials: true,
      });
      console.log("after home_page....");
      if (Response.data.msg3) {
        
        setShowlogin(false);
        setShow(true);
        Navigate("/");
        setMsg(Response.data.msg3);
      } else {
        setShowlogin(true);
        setShow(false);
        setMsg("");
      }
    };
    fetchHome();
  },[Navigate]);

  const handleTranslate = async () => {
    try {
    //   setLoading(true);
      const response = await axios.post(TRANSLATE_URL, {
        text: textToTranslate,
        language1: selectedLanguage1,
        language2: selectedLanguage2,
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
    //   setLoading(false);
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



  const logoutbtn=async()=>{
    try{
    const Response=await axios.get(LOGOUT_URL,{
      withCredentials:true,
    });
    if(Response.data){
        console.log("succesfully logout");
        setShow(false);
        setShowlogin(true);
        Navigate("/");
    }
    else{
        console.log("else in logout")
    }
}
catch(err){
    console.log("error at logout",err);
}
   

  }
  return (
    <>
      {showlogin && (
        <section className="login_display">
          <Login heading="Please Login First" />
        </section>
      )}

      {show && (
        <section className="text_container">
            <button onClick={logoutbtn} className="logoutbtn">Logout</button>
          
          <div className="textarea_container1">
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




{/* 


<section className="text_container10">
            <button onClick={logoutbtn} className="logoutbtn">Logout</button>
          
          <div className="textarea_container1">
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
          </div>
        </section>
     */}
    </>
  );
};

export default Home;
