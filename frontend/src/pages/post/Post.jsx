import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { authContext } from '../../context/authContext';
import "./Post.css";

import { FaRegCommentDots } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Footer from '../../components/footer/Footer';
export default function Post() {

  const { id } = useParams();
  const { user } = useContext(authContext);
  const [commentedOnPost, setCommentedOnPost] = useState(false);
  const [likedOnPost, setLikedOnPost] = useState(false);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [postDescription, setPostDescription] = useState("");
  const [postTopic, setPostTopic] = useState("");


  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState({

    user: 'SachinSiddhu',
    topic: "general",
    description: "",
    comments: [],
    likes: 0,
    contentType: "image",
    base64: "",

  });
  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`http://localhost:3001/post/${id}`);
      setSelectedPost(response.data);
    }
    fetchPost();
  }, [likedOnPost, commentedOnPost])


  //function for adding the like on blog.
  const likePost = async () => {
    
    try {
      const response = await axios.post(`http://localhost:3001/post/likeOnPost/${id}`, {}, {
        headers: {

          'authToken': JSON.parse(sessionStorage.getItem('authToken'))
        }
      })
      setLikedOnPost(false);
      alert("Your like counted");
      setSelectedPost(response.data)
      return;
    }
    catch (error) {
      console.log("Error in like", error)
      alert(error.response.data.error);
    }
  }

  //for commenting on the current post.
  const commentPost = async () => {
    const formData = new FormData();
    formData.append('comment', comment);
  
    try {

      const response = await axios.post(`http://localhost:3001/post/commentOnPost/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authToken':  JSON.parse(sessionStorage.getItem('authToken'))
        }
      })

      setCommentedOnPost(false);
      setComment("");
      alert("Your comment added");
      setSelectedPost(response.data)
      return;
    }
    catch (error) {
      console.log("Error in like", error)
      setCommentedOnPost(false);
      setComment("");
      alert(error.response.data.error);

    }
  }

  //for editing the post.

  const deletePost = async () => {

    try {

       
      
      const res = await axios.delete(`http://localhost:3001/post/delete/${id}`, {
        headers: {
          'authToken':JSON.parse(sessionStorage.getItem('authToken'))
        }
      })
      
      alert("Delete operation successfull.")
      navigate("/");
       }
    catch (error) {
      console.log(error);
      alert(error.response.data.error)
    }
  }


  const handlefile = (e) => {
    setFile(e.target.files[0]);
}
  const editPost = async () => {

    if(!postTopic && !postDescription && !file){
      alert("You should give some input to update post");
      return;
    }

    

    try {
      const formData = new FormData();
      if(postTopic) formData.append('topic',postTopic);
      if(postDescription) formData.append('description',postDescription);
      if(file) formData.append('file',file);
      const res = await axios.put(`http://localhost:3001/post/update/${id}`,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authToken':JSON.parse(sessionStorage.getItem('authToken'))
        }
      })
      if (res.status != 200) {
        alert("Update operation failed");
      }
      setSelectedPost(res.data);
      setEditingPost(false);
    }
    catch (error) {
      console.log(error);
      alert(error.response.data.error)
    }
  }



  const renderFile = (file) => {
    const base64Data = `data:${file.contentType};base64,${file.base64}`;
    if (file.contentType.startsWith('image/')) {
      //file type file
      return <img src={base64Data} alt={file.name} className='p-left-file' />;
    }
    else if (file.contentType.startsWith('video/')) {
      //file type video
      return <video controls src={base64Data} className='p-left-file' />;
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
      {!editingPost ?
        <div className='post'>

          <div className="p-left">
            <div className="p-left-top">
              <div className='user-details'>
                <img className="user-pic" src={`https://avatar.iran.liara.run/username?username=${selectedPost.user + selectedPost.user}`} alt='owner' />
                <span className='user-name'>{selectedPost.user}</span>
              </div>
              <div className="p-edit-remove">
                <span onClick={() => setEditingPost(true)}><FiEdit size={20} /></span>
                <span onClick={deletePost}>< RiDeleteBin6Line size={20} /></span>
              </div>
            </div>
            <span className='tag'>{selectedPost.topic}</span>

            <div>{renderFile(selectedPost)}</div>
          </div>
          <div className="p-right">
            <div className='p-right-description'>
              {selectedPost.description}
            </div>
            {!commentedOnPost ?
              <div className='p-like-comment'>
                <div className='p-like'>
                  <span >{<BiLike size={27} onClick={() => {
                    setLikedOnPost(true)
                    likePost()
                  }} />}</span>
                  <span>{selectedPost.likes}</span>
                </div>
                <div className="p-comment">
                  <span >{<FaRegCommentDots size={25}
                    onClick={() => {
                      setCommentedOnPost(true);

                    }} />}</span>
                  <span>{selectedPost.comments.length}</span>
                </div>
              </div>
              :
              <div className='comment'>
                <h3>Add Comment</h3>

                <textarea type="text" className='comment-input' value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                <button className='add-comment-btn' onClick={() => {
                  setCommentedOnPost(false);
                  commentPost();
                }}>Post</button>
              </div>
            }
          </div>
        </div>
        :
        <div className="editpost-section">
          <div className='inputs'>
            <div className='topic inputItem'>
              <label className='t-label'>Topic</label>
              <input type='text' className='topic-input' onChange={(e) => setPostTopic(e.target.value)} placeholder=' Blog topic' />
            </div>
            <div className='description inputItem'>

              <label className='d-label' >Description</label>
              <textarea type='text' className='description-input' onChange={(e) => setPostDescription(e.target.value)} placeholder='Blog content'></textarea>
            </div>
            <div className='file inputItem'>
              <label className='f-label'>File</label>
              <input type='file' className='file-input' onChange={handlefile} placeholder='no file' >
              </input>
            </div>
            <button onClick={editPost} className='btn'>Post</button>
            <button className= 'btn' onClick=  {() => setEditingPost(false)} >Cancel</button>
          </div>
        </div>

      }
      <hr className='divider'/>
      <Footer/>
    </div>
  )
}
