import React from 'react'

import { CiLinkedin } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.css";
export default function Footer() {
  return (
    <div className='f-container'>
      <span>© 2024 @BlogPost. All Rights Reserved.</span>
      <span>Privacy Policy | Terms of Service</span>
      <div className='social-media'>
        <span>Follow us on:</span><FaXTwitter size={20}/> <FiGithub size={20}/> <CiLinkedin size={20}/></div>
    </div>
  )
}
