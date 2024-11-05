import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { authContext } from '../../context/authContext';
import { useLoginWithGoogl } from '../../hooks/useLoginWithGoogle';
import { useLoginWithGithub } from '../../hooks/useLoginWithGithub';
import "./Login.css"
import logo from "../../assets/logo.jpg"
import login_left from "../../assets/login-left.jpg"
import google from "../../assets/google.png";
import github from "../../assets/github.png";
import { fetchUserDetailsFromGithub, login, googleCodeResponse } from '../../utils/authUtill';
import Alert from '../../components/alert/Alert';
export default function Login() {
    //destructuring for setting user and authToken .

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [mobileWindow, setMobileWindow] = useState(false);
    const { setUser, setAuthToken } = useContext(authContext)
    const [alert, setAlert] = useState(false);
    const [alertContent, setAlertContent] = useState({
        alertHeadline: "",
        alertMSG: ""
    });
    const { loginWithGoogle } = useLoginWithGoogl();
    const { loginWithGithub } = useLoginWithGithub();
    useEffect(() => {
        const handleResize = () => {
         window.innerWidth < 600 ? setMobileWindow(true) : setMobileWindow(false)
        }
        handleResize()
        window.addEventListener('resize',handleResize)
        return () => window.removeEventListener('resize',handleResize)
    },[window.innerWidth])
    //function to submit login credentials.
    const handleSubmit = async (e) => {
        e.preventDefault();
        //checking provided input wheather ther are empty or not
        if (!username || !password) {
            setAlert(true);
            setAlertContent({
                alertHeadline: "Error:",
                alertMSG: "Provide username and password"
            })
            return;
        }
        const { user,authToken } = await login({ username, password });
        setUser(user.username);//setting the user in auth context
        sessionStorage.setItem("user", JSON.stringify(user.username));//setting user in localStorage
        setAuthToken(authToken);//setting authToken in authContext
        sessionStorage.setItem('authToken', JSON.stringify(authToken));//settting authToken in localStorage.
        navigate('/user-posts')

    }




    return (
        <div className='login'>
            {alert &&
                <Alert setAlert={setAlert} alertContent={alertContent} />
            }
            <div className="l-container">
               {!mobileWindow && <div className='lc-left'>
                   <img className='lc-left-img' src = {login_left} alt="" />
                </div>}
                <div className='lc-right'>
                    <div className='lc-heading'>
                    <span className='lc-heading-1'>Write Your Blog</span>
                    <span className='lc-heading-2' style={{color:'rgb(21, 0, 20)'}}> With Us</span>
                    </div>
                    <form onSubmit={handleSubmit} className='input-form'>
                        <div className='formItem'>
                            <input type='text' placeholder='Username' className='username input' defaultValue={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='formItem'>
                            <input type='password' placeholder='Password' className='password input' defaultValue={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Link to='/signup' className='to-signup'>Don't have an account</Link>
                        
                            <button className='l-btn' disabled={false}>Login</button>
                       
                    </form>
                    <div className="login-with-gg">
                        <div className="login-with-github">
                            <div className='social-login' onClick={loginWithGithub}>
                                <img className='social-icons' src = { github } alt="" />
                                <span>Continue with Github</span>
                            </div>
                        </div>
                        <div className="login-with-google">
                            <div className='social-login' onClick={loginWithGoogle}>
                                <img className='social-icons' src = { google } alt="" />
                                <span>Continue with Google</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
