import React, { useEffect,useState } from "react";
import "./Home_container.css";
import { useNavigate } from "react-router-dom";
import Home from "./Home.js";
import axios from "axios";
import Login from "./Login";
import { AUTHENTICATION_URL } from "./Url.js";

const Home_container = ({ email }) => {
  console.log("homecontainer", email);
  const Navlink = useNavigate();
   const [show,setShow]=useState(false);
 
  const authenticate_verify = async () => {
    try {
      console.log("This is email:", email); // Debugging
      const GetVerify = await axios.get(AUTHENTICATION_URL, { withCredentials: true });

      if (GetVerify.status === 200 && GetVerify.data.authenticated) {
        console.log("hello");
        if (email) {
            localStorage.setItem("email", email);
          } else {
            console.error("Email is undefined or null.");
          }
             
        return true;
      } else {
       // alert("Please login to use the translation feature.");
        setShow(true);
        
        return false;
      }
    } catch (error) {
      console.error("Error during authentication or translation:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Authentication failed. Please log in again.");
        Navlink("/login");
      }
      return false;
    }
  };

  const textwork = async () => {
    console.log("Text work triggered");
    const isVerified = await authenticate_verify(); // Wait for authentication
    if (isVerified) {
      Navlink("/text");
    }
  };

  const imagework = async () => {
    console.log("Image work triggered");
    const isVerified = await authenticate_verify(); // Wait for authentication
    if (isVerified) {
      Navlink("/image");
    }
  };

  const aiTextWork = async () => {
    console.log("Generative AI text work triggered");
    const isVerified = await authenticate_verify(); // Wait for authentication
    if (isVerified) {
      Navlink("/ai-text");
    }
  };

  useEffect(() => {
    console.log("Home component rendered");
  }, []); // Empty dependency array ensures it runs only once on initial render

  return (
    <>

{show  &&    
                   <>
                  <div className="login_show">
                  <i className="fa-solid fa-xmark icon_cancel"/>

                  <Login/>
                  </div>

                  </>

      }





      <div className="Home_container">
        <div className="div_container">
          <h1>Text Translate</h1>
          <button className="hmbtn" onClick={textwork}>Use</button>
        </div>

        <div className="div_container">
          <h1>Image to Text Extract & Translate</h1>
          <button className="hmbtn" onClick={imagework}>Use</button>
        </div>

        <div className="div_container">
          <h1>Generative AI Text</h1>
          <button className="hmbtn" onClick={aiTextWork}>Use</button>
        </div>
      </div>

      {/* Home component rendering */}
      <div className="condition">
        <Home email={email} />
      </div>
    </>
  );
};

export default Home_container;
