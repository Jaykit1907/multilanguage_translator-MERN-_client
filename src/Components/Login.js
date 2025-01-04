import React, { useState } from "react";
import axios from "axios";
import {Link,useNavigate} from "react-router-dom";
import "./Login.css";


const Login=(props)=>{
    const [show,setShow]=useState(false);
    const [msg,setMsg]=useState("")
    const [loader,setLoader]=useState(false);
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSubmit=async(e)=>{
        setLoader(true);
        e.preventDefault();



        try{
        const Response=await axios.post("https://multilanguage-translator-mern-backend.vercel.app/logindata",{
            email:email,
            password:password
        },{
            withCredentials:true,
        });
        if(Response.data.msg1){
            console.log("this is1")
            setLoader(false);
            setShow(true);
            setMsg(Response.data.msg1);
            setTimeout(()=>{
                setShow(false);
                navigate("/");
            },2000);
            
        }
        else{   
               
                setMsg(Response.data.msg);
                setLoader(false)
                setShow(true);
                setTimeout(()=>{
                    setShow(false);

                },2000);

                console.log("this is how running");
             
        }
        


        
        }
        
        catch(e){
            console.log("errored",e);
        }
        

        
    }


    return(<>

    {show && <div className="login_containermsg">
        <div className="login_containermsg1">
        <h1>{msg}</h1>
        </div>
    </div>
    
    }

    <section className="login_container">
        <form onSubmit={handleSubmit}>
            {props.heading? <h1>{props.heading}</h1>:<h1>Login</h1>}
            <input type="text" placeholder="email" name="email" required onChange={(e)=>setEmail(e.target.value)}></input>
            <input type="text" placeholder="password" name="password" required onChange={(e)=>setPassword(e.target.value)}></input>
            <button type="submit">Login</button>
            <p>Don't have an account <Link to="/signup">Signup</Link></p>
        </form>
    </section>

    {loader &&
          <div className="loading_container">
          <div className="loading"></div>
          </div>

        }
    </>)
}
export default Login;