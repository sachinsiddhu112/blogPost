import React, { useRef } from 'react'

import { CiLinkedin } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.css";
export default function Footer() {
 
  return (
    <div className='f-container' >
      <div className="title-section">
        <div className="title">BlogPost</div>
        <div className="menu-section">
          <span>Home</span>
          <span>Blogs</span>
          <span>About Us</span>
          <span>Contact Us</span>
        </div>
      </div>
      <div className="subscribe-section">
        <div className="subscribe-headline">
          Subscribe to our news letter to get latest news and updates.
        </div>
        <div className="subscribe-input">
          <input className='email-input' type='email' placeholder='Enter Your Email' />
          <button className='si-btn'>Subscribe</button>
        </div>
      </div>
      <div className="social-media-section">
        <div className="copy-rights">
          <span>© 2024 BlogPost. All rights reserved.</span>
          <span>sachin@gmail.com</span>
        </div>
        <div className="social-media">
          <CiLinkedin size={25} />
          <FaXTwitter size={20}/>
          <FiGithub size={20}/>
        </div>
      </div>
    </div>
  )
}
