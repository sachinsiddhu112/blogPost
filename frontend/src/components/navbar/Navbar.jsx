import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { TiThMenuOutline } from "react-icons/ti";
import { AiFillProfile } from "react-icons/ai";
import "./Navbar.css"
import { color } from 'framer-motion';
import { authContext } from '../../context/authContext';
export default function Navbar() {
    const navigate = useNavigate();
    const [mobileWindow, setMobileWindow] = useState(false);
    const [menuToggle, setMenuToggle] = useState(false);
    const {user} = useContext(authContext)
    useEffect(() => {
        const handleResize = () => {
            window.innerWidth < 700 ? setMobileWindow(true) : setMobileWindow(false)
        }
        handleResize();
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [window.innerWidth])

    return (

        <div className="h-top" style={mobileWindow ? {backgroundColor:"transparent"}:{backgroundColor:`#232536`}}>
            <div className={`h-top-left`} onClick={() => navigate("/")}>

                <span className='title' style={mobileWindow ? { color: `${color}` } : {}}>BlogPost</span>
            </div>
            <div className={`h-top-right${menuToggle ? ' toggle-menu' : ""}`} style={{ color: `white` }}>
                <Link className='link' to="/" style={mobileWindow ? { fontSize: "x-large" } : {}}>Home</Link>
                <Link className='link' to="/blogs" style={mobileWindow ? { fontSize: "x-large" } : {}} >Blogs</Link>
                <Link className='link' to="/contact" style={mobileWindow ? { fontSize: "x-large" } : {}}>Contact Us</Link>
                {!user ?
                <button className='nav-login-btn1' style={mobileWindow ? { fontSize: "x-large", borderColor: `color`, border: 'solid' } : {}}
                onClick={() => navigate('/login')}>Login</button>
                 :
                 <button className='nav-profile-btn2' style={mobileWindow ? { fontSize: "x-large", borderColor: `color`, border: 'solid' } : {}}
                 onClick={() => navigate('/user-posts')}><AiFillProfile size={30}/></button>
                }
            </div>
            {!menuToggle && mobileWindow && <span style={{ color: `${color}`, margin: '20px 20px' }} onClick={() => setMenuToggle(true)}><TiThMenuOutline size={30} /></span>}
        </div>

    )
}
