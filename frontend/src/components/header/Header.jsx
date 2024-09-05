import React, { useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform} from 'framer-motion';

import Logo from "../../assets/logo.jpg";
import background1 from "../../assets/background-1.jpg";
import background_sub from "../../assets/background-sub-1.png";
import "./Header.css"
import { authContext } from '../../context/authContext';
export default function Header(props) {

    const { user } = useContext(authContext);//context of signed in user with it's username.
    const navigate = useNavigate();
    const ref = useRef(null);
    const {hideHeading} = props;
    const { scrollYProgress } = useScroll({
        target:ref,
        offset:["start start", "end start"]
    })
    const backgroundY = useTransform(scrollYProgress, [0,1],["0%","150%"]);
   
    
    return (
        <div className='h-container' ref={ref}>
            <div className="header" >
                <div className="h-top">
                    <div className="h-top-left" onClick={() => navigate("/")}>
                        
                        <span className='title'>BlogPost</span>
                    </div>
                    <div className="h-top-right">
                        {!user ?
                            <div className='not-user'>
                                <button className='btn-login' onClick={() => navigate("/login")}>Login</button>
                                {window.screen.width >= 800 && <button className='btn-sign' onClick={() => navigate("/signup")}>Sign Up</button>}
                            </div>
                            :
                            <div className='user'>
                                <img className='circle' src={`https://avatar.iran.liara.run/username?username=${user + user}`}></img>
                                <div className='user-username'>{user}</div>
                            </div>
                        }
                    </div>
                </div>
                
                {!hideHeading && <motion.div className="heading" style={{
                    y:backgroundY
                }}>
                    <div> Stories That </div>
                    <div>Spark Conversations</div>
                </motion.div>}
                
            </div>  
        </div>
    )
}
