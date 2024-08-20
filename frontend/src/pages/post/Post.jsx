import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { authContext } from '../../context/authContext';
import "./Post.css";
export default function Post() {

  const { id } = useParams();
  const {user} = useContext(authContext);
  const [selectedPost, setSelectedPost] = useState({

    user: 'SachinSiddhu',
    topic: "general",
    description: "",
    contentType: "image",
    base64: "",

  });
  useEffect(() => {


    const fetchPost = async () => {

      const response = await axios.get(`http://localhost:3001/post/${id}`);
      setSelectedPost(response.data);
    }

    fetchPost();
  }, [])

  const renderFile = (file) => {
    console.log(file)
    const base64Data = `data:${file.contentType};base64,${file.base64}`;
    if (file.contentType.startsWith('image/')) {
      //file type file
      return <img src={base64Data} alt={file.name} className='p-left-file' />;
    }
    else if (file.contentType.startsWith('video/')) {
      //file type video
      return <video controls src={base64Data} className='p-left-file'/>;
    }
    else if (file.contentType === 'application/pdf') {
      //file type pdf document.
      return (
        <embed src={base64Data} type="application/pdf" width="100%" height="600px" />
      );
    }

  }

  return (
    <div className='container'>
      <div className='post'>

        <div className="p-left">
          <div className='user-details'>
            <img className="user-pic" src={`https://avatar.iran.liara.run/username?username=${user + user}`} alt='owner' />
            <span className='user-name'>{selectedPost.user}</span>
          </div>
          <span className='tag'>{selectedPost.topic}</span>
                            
          <div>{renderFile(selectedPost)}</div>
        </div>
        <div className="p-right">
          <div>
            {selectedPost.description}
          </div>
        </div>
      </div>
    </div>
  )
}
