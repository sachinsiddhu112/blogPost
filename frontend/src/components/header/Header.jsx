import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import articleImag from "../../assets/articleImag.jpg";
import documentImage from "../../assets/documentImage.jpg";
import multimediaImge from '../../assets/MultimediaImage.jpg';
import Logo from "../../assets/logo.jpg";
import "./Header.css"
import { authContext } from '../../context/authContext';
export default function Header() {

    const { user } = useContext(authContext);
    const navigate = useNavigate();

    return (
        <div className='h-container'>
            <div className="header">
                <div className="h-top">
                    <div className="h-top-left">
                        <img src={Logo} alt='BP' className='logo' />
                        <span className='title'>BlogPost</span>
                    </div>
                    <div className="h-top-right">
                        {!user ?
                         <div className='not-user'>
                            <button className='btn-login' onClick={() => navigate("/login")}>Login</button>
                           {window.screen.width >=800 && <button className='btn-sign' onClick={() => navigate("/signup")}>Sign Up</button>}
                        </div>
                            :
                            <div className='user'>
                                <img className='circle' src={`https://avatar.iran.liara.run/username?username=${user + user}`}></img>
                                <div className='user-username'>{user}</div>
                            </div>
                        }
                    </div>
                </div>
            </div>


            <div className='noNewPost'>
                <div className='noPost-postSection' >
                    <img src={`https://avatar.iran.liara.run/username?username=${user + user}`} alt="loading" />
                    <div className='newPostUpdater' onClick={() => navigate("/createPost")}>Create Your New Blog...</div>

                </div>
                <div className='noPost-infoSection'>
                    <div className='infoItem'>
                        <img src={multimediaImge} />
                        <span>Images</span>
                    </div>
                    <div className='infoItem'>
                        <img src={documentImage} />
                        <span>Documents</span>
                    </div>
                    <div className='infoItem'>
                        <img src={articleImag} />
                        <span>Ariticles</span>
                    </div>
                </div>
            </div>

        </div>
    )
}
