import React, { useContext, useState, useRef } from 'react'

import { motion, useScroll, useTransform } from 'framer-motion';


import "./Header.css"
import { authContext } from '../../context/authContext';
import Navbar from '../navbar/Navbar';
export default function Header(props) {

    const { user } = useContext(authContext);//context of signed in user with it's username.
    
    const ref = useRef(null);
    const { hideHeading } = props;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })
    const backgroundY = useTransform(scrollYProgress, [0, 1], [1, 0]);


    return (
        <div className='h-container' ref={ref}>
            <div className="header" >
                
                <Navbar/>
                {!hideHeading &&
                    <div className="heading">
                        <div> Unveiling Stories,</div>
                        <div> One Blog at a Time</div>
                    </div>}
                <div className='desc'>
                    <span> An online platform where you can create, share, and publish their thoughts, stories, or expertise in the form of blog postsIt serves as a digital space for individuals, professionals, or businesses to engage with readers by offering content on various topics like lifestyle, technology, travel, or personal experiences.
                    </span>
                </div>

            </div>
            <motion.div className='header-back' style={{ opacity: backgroundY }}>

            </motion.div>
        </div>
    )
}
