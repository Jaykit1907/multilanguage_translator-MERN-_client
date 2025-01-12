import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { LOGIN_URL } from "./Url";

const Login = (props) => {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true, // Ensure credentials are sent with the request
        }
      );

      if (response.data.msg1) {
        setLoader(false);
        setShow(true);
        setMsg(response.data.msg1);
        setTimeout(() => {
          setShow(false);
          // Navigate after a successful login
          navigate("/", { state: { loggedIn: true } });
          window.location.reload();
        }, 2000);
      } else {
        setMsg(response.data.msg);
        setLoader(false);
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 2000);
      }
    } catch (e) {
      console.error("Error:", e);
      setLoader(false);
      setMsg("An error occurred. Please try again.");
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  };

  return (
    <>
      {show && (
        <div className="login_containermsg">
          <div className="login_containermsg1">
            <h1>{msg}</h1>
          </div>
        </div>
      )}

      <section className="login_container">
        <form onSubmit={handleSubmit}>
          {props.heading ? <h1>{props.heading}</h1> : <h1>Login</h1>}
          <input
            type="email"
            placeholder="email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <p>
            Don't have an account <Link to="/signup">Signup</Link>
          </p>
        </form>
      </section>

      {loader && (
        <div className="loading_container">
          <div className="loading"></div>
        </div>
      )}
    </>
  );
};

export default Login;
