import React, { useEffect, useState, useRef } from 'react'
import emailjs from '@emailjs/browser';
import "./Contact.css";
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Alert from '../../components/alert/Alert';
import ChatBot from '../../components/chatBot/ChatBot.jsx'
import { notifyAdminForNewSubs } from '../../utils/NotificationsUtils';
export default function Contact() {
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState({
    alertHeadline: "",
    alertMSG: ""
  })
  const form = useRef();
  const [mobileWindow, setMobileWindow] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 700 ? setMobileWindow(true) : setMobileWindow(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.current['email'].value || !form.current['name']) {
      setAlert(true);
      setAlertContent
        ({
          alertHeadline: 'Error',
          alertMSG: 'Provide your email!'
        })
      return;
    }
    //function to notify admin about user query.
      notifyAdminForNewSubs({form, type:'query'})
      .then((result) => {
          setAlert(true);
          alertContent
          ({
             alertHeadline:'success',
             alertMSG:'You subscribed us successfuly.'
          })
      }).catch((err) => {
        setAlert(true);
        alertContent
        ({
           alertHeadline:'failed',
           alertMSG:'Please try agian.'
        })
      })
   
    
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false);
    }, 4000)
    return () => clearTimeout(timeout);
  }, [handleSubmit])


  return (
    <div className='contact-container'>
      <Navbar color='#232536' />
      <div className="contact-header">
        <span className='contact-title'>CONTACT US</span>
        <span className='contact-headline'>Lets Start a Conversation.</span>
        <span className='contact-desc'>Have any questions or need assistance? Feel free to reach out  </span>
        {!mobileWindow && <span className="contact-desc">to us! We're here to help with any inquiries or feedback you may have.</span>}
      </div>
      <div className="contact-info">
        <div className="ci-left">
          <span style={mobileWindow ? { fontSize: '28px' } : {}}>Working Hours</span>
          <hr style={{ width: "100%", transform: "translateY(9px)" }} />
          <span className="ci-timing">Monday To Friday 9:00 AM To 8:00 PM </span>
          <span style={mobileWindow ? { fontSize: '28px' } : {}}>Our Support is 24/7 Available.</span>
        </div>
        {!mobileWindow && <div className="ci-right">
          <span>Contact Us</span>
          <hr style={{ width: "100%" }} />
          <span className='ci-email'>sachinsiddhu@gmail.com</span>
          <span>1234567890</span>
        </div>}
      </div>
     <div className='chatbot-container'>
        <ChatBot/>
     </div>
      
      <div className="contact-section">
        {
          alert &&
          <div className='alert'>
            <Alert setAlert={setAlert} alertContent={alertContent} />
          </div>
        }
        
        <form className='contact-form' ref={form} onSubmit={handleSubmit}>
          <input className='input-item' type='text' name='name' id='name' placeholder='Full Name' />
          <input className='input-item' type='text' name='email' id='email' placeholder='Your Email' />
          <input className='input-item' type='text' placeholder='Query Related To' />
          <textarea className='message-textarea' id='msg' name='msg' type='text' placeholder='Message' />
          <button type='submit' className='submit-btn' >Send Message</button>
        </form>
      </div>
      
      
      <Footer />
    </div>
  )
}
