import React from "react";
import {NavLink,Routes,Route} from "react-router-dom";
import Login from "./Login.js";
import Signup from "./Signup.js";
import "./Nav.css";
import Home from "./Home.js";
import Image from "./Image.js";



const Nav=()=>{
    return(<>

    <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="signup">Signup</NavLink>
      
    </nav>

    <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/image" element={<Image/>}></Route>
    </Routes>
    
    </>)
}

export default Nav;