import React, { useState, useContext } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'

import "./Signup.css"
import { authContext } from '../../context/authContext';//importing authcontext to update on successfull signup.
export default function SignUp() {

    const navigate = useNavigate();
    const { user, setUser, authToken, setAuthToken } = useContext(authContext);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//regx a mechanisim to validate email input.

    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""

    });

    //sending request to backend for signup
    const handleSubmit = async (e) => {
        e.preventDefault();
        //checking provided inputs are empty or not
        if (!inputs.username || !inputs.email || !inputs.password || !inputs.confirmPassword) {
            alert("Provide all credentials.")
            return;
        }
        //validating the email
        if (!emailRegex.test(inputs.email)) {
            alert("Not valid email")
            return;
        }
        try {
            const response = await axios.post("http://localhost:3001/auth/signup", inputs);

            setUser(response.data.response.username);//setting the user in context
            sessionStorage.setItem('user', JSON.stringify((response.data.response.username)));//setting the user in localstorage.
            setAuthToken(response.data.authToken);//settting the authToken in context
            sessionStorage.setItem('authToken', JSON.stringify((response.data.authToken)));//settting the authToken in localStorage.
            navigate("/");
        }
        catch (error) {
            console.log("error in signup", error);
            alert(error.response.data.error)
        }
    }
    return (
        <div className='signup '>
            <div className='s-container'>
                <h1>Sign Up</h1>
                <form className='form'>
                    <div className='inputItem'>
                        <label className=''>
                            <span className=''>Username</span>
                        </label>
                        <input type='text' placeholder='Unique Username' className='s-input' value={inputs.username} onChange={(e) => setInputs({ ...inputs, username: e.target.value })} />
                    </div>
                    <div className='inputItem'>
                        <label className=''>
                            <span className=''>Email</span>
                        </label>
                        <input type='email' placeholder='Unique Email' className='s-input' value={inputs.email} onChange={(e) => setInputs({ ...inputs, email: e.target.value })} />
                    </div>
                    <div className='inputItem'>
                        <label className=''>
                            <span className=''>Password</span>
                        </label>
                        <input type='password' placeholder='Your Password' className='s-input' value={inputs.password} onChange={(e) => setInputs({ ...inputs, password: e.target.value })} />
                    </div>
                    <div className='inputItem'>
                        <label className=''>
                            <span className=''>Confirm Password</span>
                        </label>
                        <input type='password' placeholder='Confirm Password' className='s-input' value={inputs.confirmPassword} onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })} />
                    </div>
                    <Link to='/login' className='link-to-login'>Already have an account</Link>
                    <div className='inputItem'>
                        <button className='s-btn' onClick={handleSubmit}>{true ? <span className=''>Signup</span> : "SignUp"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
