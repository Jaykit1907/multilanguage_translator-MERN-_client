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
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(PROTECTED_URL, { withCredentials: true });
      setUser(response.data.user);
      setEmail(response.data.email);
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await axios.get(LOGOUT_URL, { withCredentials: true });

      if (response.status === 200) {
        setIsAuthenticated(false);
        localStorage.removeItem("email");
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/">Translatify</NavLink>
        </div>

        {/* Hamburger Menu */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={menuOpen ? "nav-links active" : "nav-links"}>
          <li>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/history" onClick={() => setMenuOpen(false)}>
                  History
                </NavLink>
              </li>
              <li className="username_container">
                <p>Welcome {user}</p>
                <button className="logoutbtn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" onClick={() => setMenuOpen(false)}>
                  Signup
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/text" element={<Home />} />
        <Route
          path="/"
          element={
            loading ? (
              <p>Loading...</p>
            ) : email ? (
              <Home_container email={email} />
            ) : (
              <Home_container1 />
            )
          }
        />
        <Route path="/history" element={<History2 email={email} />} />
        <Route path="/login" element={isAuthenticated ? <p>You are already logged in!</p> : <Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/signup" element={isAuthenticated ? <p>You are already logged in!</p> : <Signup />} />
        <Route path="/ai" element={<Ai />} />
        <Route path="/image" element={<Image />} />
      </Routes>
    </>
  );
};

export default Nav;
