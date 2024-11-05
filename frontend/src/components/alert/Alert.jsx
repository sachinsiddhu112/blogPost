import React, { useEffect, useState } from 'react'
import { BiCheck } from "react-icons/bi";
import {motion, useScroll} from 'framer-motion'
import "./Alert.css"
export default function Alert({ setAlert, alertContent}) {
    const [mobileWindow, setMobileWindow] = useState(false);
    const [alertInitialPos , setAlertInitilaPos] = useState(0);
    const [finalPos , setFinalPos] = useState(0)
    useEffect(() => {
        const handleResize = () => {
         window.innerWidth < 700 ? setMobileWindow(true) : setMobileWindow(false)
        }
        handleResize()
        window.addEventListener('resize',handleResize)
        return () => window.removeEventListener('resize',handleResize)
    },[window.innerWidth])
    
    return (
        <motion.div 
        initial = {{x:0,y:alertInitialPos, opacity: 1}}
        animate = {{x:finalPos, opacity: 1}}
       
        transition={{duration:2,type:'tween'}}
        className={`alert-container`}>
            <span className='close-alert' onClick={() => setAlert(false)}>x</span>
            <div className="alert-content">
                <div className='alert-icon' style={alertContent.alertHeadline == 'Error'?{backgroundColor:'red'}:{backgroundColor:'green'}}>
                    <BiCheck />
                </div>
                <div>
                 <div className='alert-headline'>{alertContent?.alertHeadline}</div>
                 <div className='alert-msg'>{alertContent?.alertMSG}</div>
                </div>
            </div>
        </motion.div>
    )
}
