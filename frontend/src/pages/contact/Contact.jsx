import React from 'react'

import "./Contact.css";
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
export default function Contact() {
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
            <div className="contact-section">
                <form className='contact-form' >
                    <input type='text' placeholder='Full Name' />
                    <input type='text' placeholder='Your Email' />
                    <input type = 'text' placeholder='Query Related To' />
                    <textarea type = 'text' placeholder='Message' />
                    <button type='submit' className='submit-btn' >Send Message</button>
                </form>
            </div>
            <Footer />
        </div>
    )
}
