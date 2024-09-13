import React from 'react'
import { useNavigate , Link} from 'react-router-dom';

import "./Navbar.css"
export default function Navbar() {
    const navigate = useNavigate();
  return (
    
      <div className="h-top">
                    <div className="h-top-left" onClick={() => navigate("/")}>

                        <span className='title'>BlogPost</span>
                    </div>
                    <div className="h-top-right">
                        
                       <Link className='link' to="/" >Home</Link>
                        <Link className='link' to = "/blogs">Blogs</Link>
                        <Link className='link' to = "/contact">Contact Us</Link>
                        <button className='subscribe-btn'>Subscibe</button>
                    </div>
                </div>
    
  )
}
