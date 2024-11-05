import React, { useContext, useState, useRef, useEffect } from 'react'

import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Typewriter } from 'react-simple-typewriter'
import "./Header.css"
import { authContext } from '../../context/authContext';
import Navbar from '../navbar/Navbar';
import { useWindowWidth } from '../../hooks/windowWidth.js'
export default function Header() {

    const { user } = useContext(authContext);//context of signed in user with it's username.

    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })
    const backgroundY = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const { mobileWindow } = useWindowWidth()
    return (
        <div className='h-container' ref={ref}>
            <div className="header" >
                <Navbar />
                <div className="heading">
                    <div>Unveile your
                    <Typewriter words={[" Knowledge", " Stories"]}
                    typeSpeed={300}
                    delaySpeed={100}
                    loop = {false}
                    cursor = {true}
                    cursorStyle = '|'
                    cursorColor='black'/>
                    </div>
                    <div>Share your
                     <Typewriter 
                     words={[" Stories", " Knowledge"]}
                     typeSpeed={300}
                     delaySpeed={100}
                     loop = {false}
                     cursor = {true}
                     cursorStyle = '|'
                     cursorColor='black'/>
                     </div>
                    
                </div>
                

            </div>
            <motion.div className='header-back' style={{ opacity: backgroundY }}>

            </motion.div>
        </div>
    )
}
