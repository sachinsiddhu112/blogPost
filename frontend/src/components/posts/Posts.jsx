import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { FaRegCommentDots } from "react-icons/fa";
import { BiLike } from "react-icons/bi";

import "./Posts.css"
import { authContext } from '../../context/authContext';
export default function Posts() {

    const navigate = useNavigate();
    const { user } = useContext(authContext)
    const [data, setData] = useState([]);
   
   
    

    useEffect(() => {

        const fetchAllfiles = async () => {
            try {
                const response = await axios.get('http://localhost:3001/post/allPosts');

                setData(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        

        fetchAllfiles();
       
    }, [])

   

   

    //checking the file type in a particular post to show it on web page.
    const renderFile = (file) => {

        const base64Data = `data:${file.contentType};base64,${file.base64}`;
        if (file.contentType.startsWith('image/')) {
            //file type file
            return <img src={base64Data} alt={file.name} className='all-posts-post-file' />;
        }
        else if (file.contentType.startsWith('video/')) {
            //file type video
            return <video controls src={base64Data} className='all-posts-post-file' />;
        }
        else if (file.contentType === 'application/pdf') {
            //file type pdf document.
            return (
                <embed src={base64Data} type="application/pdf" width="100%" height="600px" />
            );
        }

    }
    console.log(data)
    return (
        <div className='post-container'>
            
            <div className='all-posts'>

                {data.map((post, ind) => (
                    <div key={post._id} className='all-posts-post'>


                        <div className='all-posts-post-details' onClick={() => navigate(`/post/${post._id}`)}>
                            <div className='user-details'>
                                <img className="user-pic" src={`https://avatar.iran.liara.run/username?username=${post.user + post.user}`} alt='owner' />
                                <span className='user-name'>{post.user}</span>

                            </div>
                            <span className='tag'>{post.topic}</span>

                            {renderFile(post)}
                            
                        </div>
                        <div className='p-like-comment'>
                                <div className='p-like'>
                                    <span >{<BiLike size={27} onClick={() => {
                                       alert("Please visit the blog for like.")
                                    }}/>}</span>
                                    <span>{post.likes}</span>
                                </div>
                                <div className="p-comment">
                                    <span >{<FaRegCommentDots size={25} 
                                    onClick={() => {
                                       alert("Please visit the blog for commenting.")
                                    }} />}</span>
                                    <span>{post.comments.length}</span>
                                </div>
                            </div>
                    </div>
                ))}

            </div>
        </div>
    )
}
