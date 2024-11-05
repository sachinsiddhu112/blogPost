import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BallTriangle } from 'react-loader-spinner';
import Navbar from '../../components/navbar/Navbar.jsx'
import Footer from '../../components/footer/Footer.jsx'
import "./authorProfile.css";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { authContext } from '../../context/authContext.js';
import axios from 'axios';
import { deletePost } from '../../utils/postUtilFunctions.js';
import { useNavigate } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa6';
import { fetchAuthorPosts } from '../../utils/postUtilFunctions.js';
import Alert from '../../components/alert/Alert.jsx';
import { useWindowWidth } from '../../hooks/windowWidth.js';
export default function AuthorProfile() {
    const { user } = useContext(authContext);
    const url = process.env.REACT_APP_HOST
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();
    const refToDeletPost = useRef('');
    const [postByStatus, setPostByStatus] = useState('public');
    const queryClient = useQueryClient();
    const [alert, setAlert] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [alertContent, setAlertContent] = useState({
        alertHeadline: '',
        alertMSG: ''
    });
    const {
        status,
        error,
        data: posts,
        refetch
    } = useQuery({
        queryKey: ['post', `user:${user}:${postByStatus}`],
        queryFn: async () => {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                navigate('/login')
            }
            const response = await fetchAuthorPosts(`/authorAllPosts?status=${postByStatus}`, token);
            return response;
        }
    })
    useEffect(() => {
        refetch()
    }, [postByStatus])
    const handleDeletePost = useCallback(async () => {
        setLoading(true)
        setIsDeleting(false)
        const res = await deletePost({ id: refToDeletPost.current });
        if (res.status == 'success') {
            queryClient.invalidateQueries([`post`]);
           
        }
        setLoading(false)
        setAlert(true);
        setAlertContent
            ({
                alertHeadline: res.status,
                alertMSG: res.msg
            });

    }
        , [])
    console.log(posts);
    if (status == 'pending' || loading == true) return <BallTriangle
        height={200}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
    />
    if (error) return <h1>Error</h1>
    if (isDeleting)
        return (
            <div className='delete-container'>
             <div className="delete-modal">
                 <span className='modal-headline' >Delete this post</span>
                 <div className="dm-btns">
                    <button   onClick={() => handleDeletePost()} >Delete</button>
                    <button  onClick = {() => 
                        {  
                            setIsDeleting(false);
                        }}>Cancel</button>
                 </div>
             </div>
            </div>)
    return (
        <div className='up-container'>
            <Navbar color='#232536' />
            <div className="upc-top">
                <div className='upct-h2'>Here your all posts will be available.</div>
                <div className='upct-h3'>You can manage your posts or create new post.</div>
                <div className='upct-h2'>No operation is undoable,so be carefull.</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', width: 'fit-content' }}>
                <span style={{ fontSize: '24px', fontWeight: '700' }}>All Posts:</span>
                <span style={{ fontSize: '20px', fontWeight: '600', border: '1.5px solid black', padding: '5px 5px', borderRadius: '10px', cursor: 'pointer' }} onClick={() => navigate('/createPost')}>New Post</span>
            </div>
            {
                alert && <Alert setAlert={setAlert} alertContent={alertContent} />
            }

            <div className="post-status">
                <div className={`status-public ${postByStatus == 'public' ? "post-status-highlight" : ""}`}
                    onClick={() => setPostByStatus('public')}>Public</div>
                <div className={`status-upcoming ${postByStatus == 'upcoming' ? "post-status-highlight" : ""}`}
                    onClick={() => setPostByStatus('upcoming')}>Upcoming</div>
            </div>
            <hr style={{ width: '100%', height: '4px', color: 'gray' }} />
            {postByStatus == 'public' ?
                <div className="upc-posts">
                    {posts.length > 0 ?
                        posts.map((post, ind) => (
                            <div className='upc-single-post' key={post._id}>
                                <img src={`data:${post.contentType};base64,${post.base64}`} alt={post.name} className='upc-post-img' onClick={() => navigate(`/post/${post._id}`
                                    , { state: { category: post.category } })} />
                                <div className='upc-post-cat'>
                                    <div className="up-category">{post.category.toUpperCase()} </div>
                                    <div className="icon" onClick={() => navigate(`/updatePost/${post._id}`, {
                                        state:
                                        {
                                            topic: post.topic,
                                            description: post.description,
                                            category: post.category.toLowerCase(),
                                            status: post.status,
                                            file: true
                                        }
                                    })}>{<FaRegEdit size={20} />}</div>
                                    <div className="icon" onClick={() => {
                                        refToDeletPost.current = post._id
                                        setIsDeleting(true)
                                    }}>{<AiOutlineDelete size={20} />}</div>
                                </div>
                                <div className='upc-post-headline' onClick={() => navigate(`/post/${post._id}`
                                    , { state: { category: post.category } })}>{post.topic.substring(0, post.topic.length < 65 ? post.topic.length : 65)}{"..."}
                                </div>
                            </div>
                        ))
                        :
                        <h2>No Post To show.</h2>
                    }
                </div>
                :
                <div className='uuc-posts'>
                    {posts.length > 0 ?

                        posts.map((post, ind) => (
                            <div className='uuc-single-post'
                                style={{ height: '130px' }}
                                key={post._id}>
                                <div className='upc-post-cat'>
                                    <div className="up-category">{post.category.toUpperCase()} </div>
                                    <div className="icon" onClick={() => navigate(`/updatePost/${post._id}`,
                                        {
                                            state:
                                            {
                                                topic: post.topic,
                                                description: post.description,
                                                category: post.category.toLowerCase(),
                                                status: post.status,
                                                file: post.contentType != null ? true : false
                                            }
                                        })}>{<FaRegEdit size={20} />}</div>
                                    <div className="icon" onClick={() => {
                                        refToDeletPost.current = post._id
                                        setIsDeleting(true)
                                    }}>{<AiOutlineDelete size={20} />}</div>
                                </div>
                                <div className='uuc-post-headline'>{post.topic}
                                </div>

                            </div>
                        ))
                        :
                        <h2>No Post To show.</h2>
                    }

                </div>
            }
            <Footer />
        </div>
    )
}
