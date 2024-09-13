import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

import "./Login.css"
import { authContext } from '../../context/authContext';
export default function Login() {
    //destructuring for setting user and authToken .
    const { user, setUser, authToken, setAuthToken } = useContext(authContext)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //function to submit login credentials.
    const handleSubmit = async (e) => {
        e.preventDefault();
        //checking provided input wheather ther are empty or not
        if (!username || !password) {
            alert("Provide all credentials.")
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_HOST}/auth/login`, { username, password })
            setUser(response.data.user.username);//setting the user in auth context
            sessionStorage.setItem("user", JSON.stringify(response.data.user.username));//setting user in localStorage
            setAuthToken(response.data.authToken);//setting authToken in authContext
            sessionStorage.setItem('authToken', JSON.stringify(response.data.authToken));//settting authToken in localStorage.
            navigate("/createPost");
        }
        catch (error) {
            console.log("Error in login in", error);
            alert(error.response.data.error)
        }
    }
    return (
        <div className='login'>
            <div className="l-container">
                <h1 className=''>Login</h1>
                <form onSubmit={handleSubmit} className='input-form'>
                    <div className='formItem'>
                        
                        <input type='text' placeholder='Username' className='username input' defaultValue={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className='formItem'>
                       
                        <input type='password' placeholder='Password' className='password input' defaultValue={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Link to='/signup' className='to-signup'>Don't have an account</Link>

                    <div className='formItem'>
                        <button className='l-btn' disabled={false}>{true ? (<span className='loading '>Login</span>) : "Login"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
