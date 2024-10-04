import React, { useEffect, useState } from 'react'

import "./Contact.css";
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Alert from '../../components/alert/Alert';
export default function Contact() {
    const [alert, setAlert] = useState(false);
    const [alertContent,setAlertContent] = useState({
        alertHeadline:"",
        alertMSG:""
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        setAlert(true)
        setAlertContent({
            alertHeadline:"Successful Submission.",
            alertMSG:"We got your querry.Till that use our chatbot for instant help"
        })  
    }
    useEffect(() => {
       const timeout = setTimeout(() => {
        setAlert(false);
       },4000)
    return () => clearTimeout(timeout);
    },[handleSubmit])
    
    console.log(alert)
    return (
        <div className='contact-container'>
            <Navbar />
            <div className="contact-header">
                <span className='contact-title'>CONTACT US</span>
                <span className='contact-headline'>Lets Start a Conversation.</span>
                <span className='contact-desc'>Have any questions or need assistance? Feel free to reach out  </span>
                <span className="contact-desc">to us! We're here to help with any inquiries or feedback you may have.</span>
            </div>
            <div className="contact-info">
                <div className="ci-left">
                    <span>Working Hours</span>
                    <hr style={{width:"100%",transform:"translateY(9px)"}} />
                    <span className="ci-timing">Monday To Friday 9:00 AM To 8:00 PM </span>
                    <span>Our Support is 24/7 Available.</span>
                </div>
                <div className="ci-right">
                    <span>Contact Us</span>
                    <hr style={{width:"100%"}}/>
                    <span className='ci-email'>sachinsiddhu@gmail.com</span>
                    <span>1234567890</span>
                </div>
            </div>
            {
                alert && 
                <div className='alert'> 
                <Alert setAlert={setAlert} alertContent = {alertContent} />
                </div>
            }
            <div className="contact-section">
                <form className='contact-form' >
                    <input type='text' placeholder='Full Name' />
                    <input type='text' placeholder='Your Email' />
                    <input type = 'text' placeholder='Query Related To' />
                    <textarea className='message-textarea' type = 'text' placeholder='Message' />
                    <button type='submit' className='submit-btn' onClick={handleSubmit} >Send Message</button>
                </form>
            </div>
            <Footer />
        </div>
    )
}
