import "./login.css";
import * as Icon from 'react-bootstrap-icons';
import { useState,useRef } from 'react';
import axios from "axios";

export default function Login({setShowLogin,myStorage,setCurrentUser}) {
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const res = await axios.post("/users/login",user);
            myStorage.setItem("user",res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false);
        } catch (err) {
            setError(true);
        }
    }
  return (
    <div className="loginContainer">
        <div className="logo">
            <Icon.GeoFill/>
            Travel Map Pin
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref={nameRef}/>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className="loginBtn">登入</button>
            { error &&(
                <span className="failure">登入失敗</span>
            )}
            
        </form>
        <Icon.X className="loginCancel" onClick={()=>setShowLogin(false)}/>
    </div>
  )
}