import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import signup_left from "../../assets/signup-left.jpg"
import "./Signup.css"
import Alert from '../../components/alert/Alert';
import { authContext } from '../../context/authContext';//importing authcontext to update on successfull signup.
export default function SignUp() {

    const navigate = useNavigate();
    const { setUser, setAuthToken } = useContext(authContext);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//regx a mechanisim to validate email input.
    const [mobileWindow, setMobileWindow] = useState(false);
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""

    });
    const [alert, setAlert] = useState(false);
    const [alertContent, setAlertContent] = useState({
        alertHeadline: "",
        alertMSG: ""
    });
    useEffect(() => {
        const handleResize = () => {
         window.innerWidth < 600 ? setMobileWindow(true) : setMobileWindow(false)
        }
        handleResize()
        window.addEventListener('resize',handleResize)
        return () => window.removeEventListener('resize',handleResize)
    },[window.innerWidth])
    //sending request to backend for signup
    const handleSubmit = async (e) => {
        e.preventDefault();
        //checking provided inputs are empty or not
        if (!inputs.username || !inputs.email || !inputs.password || !inputs.confirmPassword) {
            setAlert(true);
            setAlertContent({
                alertHeadline: 'Error:',
                alertMSG: 'Provide all credentials!'
            })
            return;
        }
        //validating the email
        if (!emailRegex.test(inputs.email)) {
            alert("Not valid email")
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_HOST}/auth/signup`, inputs);
            setUser(response.data.response.username);//setting the user in context
            sessionStorage.setItem('user', JSON.stringify((response.data.response.username)));//setting the user in localstorage.
            setAuthToken(response.data.authToken);//settting the authToken in context
            sessionStorage.setItem('authToken', JSON.stringify((response.data.authToken)));//settting the authToken in localStorage.
            navigate("/createPost");
        }
        catch (error) {
            console.log("error in signup", error);
            alert(error.response.data.error)
        }
    }
    return (
        <div className='signup '>
            {alert &&
                <Alert setAlert={setAlert} alertContent={alertContent} />
            }
            <div className='s-container'>
               {!mobileWindow && <div className='sc-left'>
                    <img className='sc-left-img' src={signup_left} alt="" />
                </div>}
                <div className='sc-right'>
                    <div className='sc-right-heading'>
                        <span className='scr-heading-1'>Join us for Sharing</span>
                        <span className='scr-heading-2'>Your Knowledge</span>
                    </div>
                    <form className='form'>
                        <div className='inputItem'>
                            <input type='text' placeholder='Unique Username'
                                className='s-input' value={inputs.username} onChange={(e) => setInputs({ ...inputs, username: e.target.value })} />
                        </div>
                        <div className='inputItem'>

                            <input type='email' placeholder='Unique Email'
                                className='s-input' value={inputs.email} onChange={(e) => setInputs({ ...inputs, email: e.target.value })} />
                        </div>
                        <div className='inputItem'>

                            <input type='password' placeholder='Your Password'
                                className='s-input' value={inputs.password} onChange={(e) => setInputs({ ...inputs, password: e.target.value })} />
                        </div>
                        <div className='inputItem'>

                            <input type='password' placeholder='Confirm Password'
                                className='s-input' value={inputs.confirmPassword} onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })} />
                        </div>
                        <Link to='/login' className='link-to-login'>Already have an account</Link>
                        <button className='s-btn' onClick={handleSubmit}>Signup</button>

                    </form>
                </div>
            </div>
        </div>
    )
}
