import React,{useState} from "react";
import "./Login.css";
import axios from "axios";
import {Link} from "react-router-dom";
import {SIGNUP_URL} from "./Url.js";
import { useNavigate } from "react-router-dom";
const Signup=()=>{

            const navigate=useNavigate();
            const  [alldata,setAlldata]=useState({
                name:"",
                phone:"",
                email:"",
                password:"",
                cpassword:""
            });
             const [show,setShow]=useState(false);
             const [msg,setMsg]=useState("")
             const [loader,setLoader]=useState(false);


            const handleSubmit=async(e)=>{
                setLoader(true);
                e.preventDefault();

                try{
                const Response= await axios.post(SIGNUP_URL,{
                    name:alldata.name,
                    phone:alldata.phone,
                    email:alldata.email,
                    password:alldata.password,
                    cpassword:alldata.cpassword

                },{
                    withCredentials:true,
                }

                    );

                    if(Response.data){
                        console.log("succefully connected");

                        if(Response.data.msg1){
                        
                            setShow(true);
                            setLoader(false);
                            setMsg(Response.data.msg1);
                            setTimeout(()=>{
                                setShow(false);
                                navigate("/login");

                            },2000)
                           

                        }
                        else{
                            setShow(true);
                            setLoader(false);
                            setMsg(Response.data.msg2);
                            setTimeout(()=>{
                                setShow(false);
                               
                            },2000)
                           

                        }

                       

                    }
                    else{
                        console.log("error occured");
                    }
                }
                catch(e){
                    console.log("error",e);
                    setLoader(false);
                    setShow(true);
                    setMsg("Error in Signup");
                    setTimeout(()=>{
                        setShow(false);
                    },2000);
                }

            







            }

            const handleChange=(e)=>{
               const name=e.target.name;
               const value=e.target.value;

               
              
                setAlldata((prev)=>{
                    return({
                        ...prev,
                        [name]:value
                });
                })
               
            

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
            <h1>Signup</h1>
            <input type="text" placeholder="name" name="name" required value={alldata.name} onChange={handleChange}></input>
            <input type="number" placeholder="phone no" name="phone" required value={alldata.phone} onChange={handleChange}></input>
            <input type="text" placeholder="email" required  name="email" value={alldata.email} onChange={handleChange}></input>
            <input type="text" placeholder="password" required name="password" value={alldata.password} onChange={handleChange}></input>
            <input type="text" placeholder="confirm password" required name="cpassword" value={alldata.cpassword} onChange={handleChange}></input>
          
            <button type="submit">Signup</button>
            <p>Already have an account <Link to="/login">Login</Link></p>
        </form>
    </section>


    {loader &&
          <div className="loading_container">
          <div className="loading"></div>
          </div>

        }
    
    </>)
}

export default Signup;
