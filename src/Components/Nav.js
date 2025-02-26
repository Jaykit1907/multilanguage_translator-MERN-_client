import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login.js";
import Signup from "./Signup.js";
import Home from "./Home.js";
import Image from "./Image.js";
import Ai from "./Ai.js";
import axios from "axios";
import { LOGOUT_URL, PROTECTED_URL } from "./Url.js";
import "./Nav.css";
import History2 from "./History2.js";
import Home_container from "./Home_container.js";
import Home_container1 from "./Home_container1.js";

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

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
    } finally {
      setLoading(false); // End loading state
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
        setIsAuthenticated(false);
       // Update state to reflect the user is logged out
       localStorage.removeItem("email");

        navigate("/");
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
            <NavLink to="/history">History</NavLink>
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
        <Route path="/text" element={<Home />} />
        <Route
          path="/"
          element={
            loading ? (
              <p>Loading...</p> // Show loading message while fetching email
            ) : email ? (
              <Home_container email={email} /> // Render Home_container when email is available
            ) : (
              <Home_container1 /> // Render fallback component if email is not set
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
        <Route path="/ai" element={<Ai />} />
        <Route path="/image" element={<Image />} />
        
      </Routes>
    </>
  );
};

export default Nav;
