import React, { useRef, useEffect, useState } from 'react'

import { CiLinkedin } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.css";
import { notifyAdminForNewSubs, addNewSub } from '../../utils/NotificationsUtils.js'
import Alert from '../alert/Alert';
import { useWindowWidth } from '../../hooks/windowWidth';
export default function Footer() {
  const {mobileWindow} = useWindowWidth();
  const [alert, setAlert] = useState(false);
  const [email, setEmail] = useState('');
  const [alertContent, setAlertContent] = useState({
    alertHeadline: "",
    alertMSG: ""
  })
  const form = useRef();
  //function to add new subscriber into database and send success email to user.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.current['email'].value) {
      setAlert(true);
      setAlertContent
        ({
          alertHeadline: 'Error',
          alertMSG: 'Provide your email!'
        })
      return;
    }
    const email = form.current['email'].value
    //function from NotificationsUtils.js.
    const response = await addNewSub({ email });
    //from backend getting appropriate status and msg for showing alert.
    setAlert(true);
    setAlertContent({
      alertHeadline: response.status,
      alertMSG: response.msg
    });

    if (response.status == 'failed') {
      setEmail('')
      return;
    }
    //function to notify admin for new subscriber.
    notifyAdminForNewSubs({form,type:'newSub'})
    setEmail('')
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false);
    }, 4000)
    return () => clearTimeout(timeout);
  }, [handleSubmit])
  console.log("alert",alert)
  return (
    <div className='f-container' >
      {alert &&
        <Alert setAlert={setAlert} alertContent={alertContent} />}

      <div className='f-content'>
        <div className="title-section">
          <div className="f-title">BlogPost</div>
          {!mobileWindow && <div className="menu-section">
            <span>Home</span>
            <span>Blogs</span>
            <span>About Us</span>
            <span>Contact Us</span>
          </div>}
        </div>

        <div className="subscribe-section">
          <div className="subscribe-headline">
            Subscribe to our news letter to get latest news and updates.
          </div>
          <form className="subscribe-input" ref={form} onSubmit={handleSubmit}>
            <input className='email-input' id='email' type='email' name='user_email' placeholder='Enter Your Email' value = {email} onChange ={(e) => setEmail(e.target.value)}/>
            <button className='si-btn' type='submit'>Subscribe</button>
          </form>
        </div>
        <div className="social-media-section">
          <div className="copy-rights">
            <span>© 2024 BlogPost. All rights reserved.</span>
            <span>sachin@gmail.com</span>
          </div>
          <div className="social-media">
            <CiLinkedin size={25} />
            <FaXTwitter size={20} />
            <FiGithub size={20} />
          </div>
        </div>
      </div>
    </div>
  )
}
