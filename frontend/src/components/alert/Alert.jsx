import React, { useEffect } from 'react'
import { BiCheck } from "react-icons/bi";

import "./Alert.css"
export default function Alert({setAlert, alertContent}) {
    useEffect(() => {
       const timeOut = setTimeout(setAlert(false),2000);
       return ()=> clearTimeout(timeOut);
    },[])
    return (
        <div className='alert-container'>
            <span className='close-alert' onClick={() => setAlert(false)}>x</span>
            <div className="alert-content">
                <div className='alert-icon'>
                    <BiCheck />
                </div>
                <div>
                 <div className='alert-headline'>{alertContent?.alertHeadline}</div>
                 <div className='alert-msg'>{alertContent?.alertMSG}</div>
                </div>
            </div>
        </div>
    )
}
