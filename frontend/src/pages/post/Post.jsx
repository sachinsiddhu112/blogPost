import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { authContext } from '../../context/authContext';
import { Comment, BallTriangle } from 'react-loader-spinner';
import "./Post.css";

import { FaRegCommentDots } from "react-icons/fa";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import { likePost, commentPost, deletePost, editPost } from '../../utils/PostInteraction';

export default function Post() {
  //variables.
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
  const [commentLoading, setCommentLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState({
    user: 'SachinSiddhu',
    topic: "general",
    description: "",
    comments: [],
    likes: [],
    contentType: "image",
    base64: "",
  });

  //loading the selectedPost .
  useEffect(() => {
    setLoadingPost(true);
    try {
      const fetchPost = async () => {
        const response = await axios.get(`https://blog-post-backend.vercel.app/post/${id}`);
        setSelectedPost(response.data);
        setLoadingPost(false)
      }
      fetchPost();
    }
    catch (error) {
      alert(error.response.data.error);
    }

  }, [likePost, commentPost,editPost])

//for liking on current post.
const handleLike = async () => {
  const newPost = await likePost({id});
  setSelectedPost(newPost);
}

  //for commenting on the current post.
  const handleComment = async () => {
    setCommentedOnPost(false)
    setCommentLoading(true);
    const newPost = await commentPost({ comment, id });
    setComment("");
    setCommentLoading(false);
    setSelectedPost(newPost)

  }
  //for deleting the post.
  const handleDeletePost = async () => {
    await deletePost({ id })
    navigate("/");
  }
  //handeling the file for updating the file in blog.
  const handlefile = (e) => {
    setFile(e.target.files[0]);
  }
  //updating the blog.
  const handleEditPost = async () => {
    setLoadingPost(true);
   const newPost =  await editPost({postTopic, postDescription,file,id});
    setEditingPost(false);
    setLoadingPost(false)
    setSelectedPost(newPost)
  }
  //function to render the file on web page.
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
      <div style={{
        height:"30vh",
        width:"100%"
      }}>
      <Header hideHeading={true} />
      </div>
      <div>
        {loadingPost ?
          <BallTriangle
            height={200}
            width={100}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          :
          <>
            {!editingPost ?
              <div className='post'>
                <div className="p-left">
                  <div className="p-left-top">
                    <div className='user-details'>
                      <img className="user-pic" src={`https://avatar.iran.liara.run/username?username=${selectedPost.user + selectedPost.user}`} alt='owner' />
                      <span className='user-name'>{selectedPost.user}</span>
                    </div>
                    {user == selectedPost.user && <div className="p-edit-remove">
                      <span onClick={() => setEditingPost(true)}><FiEdit size={20} /></span>
                      <span onClick={handleDeletePost}>< RiDeleteBin6Line size={20} /></span>
                    </div>}
                  </div>
                  <span className='tag'>{selectedPost.topic}</span>
                  <div className='file-container'
                  >{renderFile(selectedPost)}</div>
                </div>
                <div className="p-right">
                  <div className='p-right-description'>
                    {selectedPost.description}
                  </div>
                  {!commentedOnPost ?
                    <div className='p-like-comment'>
                      <div className='p-like'>
                        <span >{!selectedPost.likes?.includes(user) ?
                          <BiLike size={27} onClick={handleLike} /> :
                          <BiSolidLike size={27} onClick={handleLike} />
                        }</span>
                        <span>{selectedPost.likes.length}</span>
                      </div>
                      <div className="p-comment">
                        {commentLoading ?
                          <Comment
                            visible={true}
                            height="40"
                            width="40"
                            ariaLabel="comment-loading"
                            wrapperStyle={{}}
                            wrapperClass="comment-wrapper"
                            color="#fff"
                            backgroundColor="#F4442E"
                          /> :
                          <span >{<FaRegCommentDots size={25}
                            onClick={() => setCommentedOnPost(true)} />}</span>
                        }
                        <span>{selectedPost.comments.length}</span>
                      </div>
                    </div>
                    :
                    <div className='comment'>
                      <h3>Add Comment</h3>
                      <textarea type="text" className='comment-input' value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                      <button className='add-comment-btn' onClick={handleComment}>Post</button>
                      <button className='cancel-comment-btn' onClick={() => setCommentedOnPost(false)}>Cancel</button>
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
                  <button onClick={handleEditPost} className='btn'>Post</button>
                  <button className='btn' onClick={() => setEditingPost(false)} >Cancel</button>
                </div>
              </div>
            }
          </>}
      </div>
      <hr className='divider' />
      <Footer />
    </div>
  )
}
