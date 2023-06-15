import "./register.css";
import * as Icon from 'react-bootstrap-icons';
import { useState,useRef } from 'react';
import axios from "axios";

export default function Register({setShowRegister}) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            await axios.post("/users/register",newUser);
            setError(false)
            setSuccess(true);
        } catch (err) {
            setError(true);
        }
    }
  return (
    <div className="registerContainer">
        <div className="logo">
            <Icon.GeoFill/>
            Travel Map Pin
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref={nameRef}/>
            <input type="email" placeholder="email" ref={emailRef}/>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className="registerBtn">註冊</button>
            { success &&(
                <span className="success">註冊成功！</span>
            )}
            { error &&(
                <span className="failure">註冊失敗...</span>
            )}
            
        </form>
        <Icon.X className="registerCancel" onClick={()=>setShowRegister(false)}/>
    </div>
  )
}