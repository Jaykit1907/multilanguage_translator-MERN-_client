import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import Login from "./Login.js";
import Signup from "./Signup.js";
import Home from "./Home.js";
import Image from "./Image.js";
import axios from "axios";
import { HOME_URL, LOGOUT_URL, PROTECTED_URL } from "./Url.js";
import "./Nav.css";
import History2 from "./History2.js";

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(PROTECTED_URL, { withCredentials: true });
      console.log("Response data:", response.data);

      const value = response.data.authenticated; // Ensure this field exists in the response
      console.log("Backend authenticated value:", value);

      setUser(response.data.user);
      setEmail(response.data.email);

      setIsAuthenticated(value); // Update state with the value from the backend
    } catch (error) {
      console.error("Error in checkAuthStatus:", error);
      setIsAuthenticated(false); // Set to false if there's an error
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []); // Runs only once on component mount

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await axios.get(LOGOUT_URL, { withCredentials: true });

      if (response.status === 200) {
        console.log(response.data.message);
        setIsAuthenticated(false); // Update state to reflect the user is logged out
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        {isAuthenticated ? (
          <>
            <div className="username_container">
              <p>Welcome {user}</p>
              <button className="logoutbtn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            email ? (
              <Home email={email} />
            ) : (
              <p>Loading email...</p> // Show a loading message if email is not yet available
            )
          }
        />

        <Route path="/history" element={<History2 email={email} />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <p>You are already logged in!</p>
            ) : (
              <Login onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <p>You are already logged in!</p>
            ) : (
              <Signup />
            )
          }
        />
        <Route path="/image" element={<Image />} />
      </Routes>
    </>
  );
};

export default Nav;
