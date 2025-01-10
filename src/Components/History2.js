import React, { useEffect, useState } from "react";
import History from "./History";

const History2 = () => {
  const [userEmail, setUserEmail] = useState(null);

  
function getCookie(name) {
    const cookieArr = document.cookie.split("; ");
    for (const cookie of cookieArr) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value); // Decode the cookie value
        }
    }
    return null; // Return null if the cookie is not found
  }

  useEffect(() => {
    const email = getCookie("email");
    console.log("this is email",email); 
   
    if (email) {
      console.log("Email detected:", email);
     // localStorage.setItem("userEmail", email); // Save to localStorage for persistence
      setUserEmail(email);
      console.log("set email",userEmail);
    } else {
      console.error("No email detected. Please log in.");
    }
  }, []);

  return (
    <div>

      {userEmail ? (
     
        <History email={userEmail} />
      ) : (
        <p>Please log in to see your search history.</p>
      )}
    </div>
  );
};

export default History2;
