import React, { useContext, useRef } from 'react'
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
export default function AuthorProfile() {
    const { user } = useContext(authContext);
    const url = process.env.REACT_APP_HOST
    const navigate = useNavigate();
    const refToDeletPost = useRef('');
    const queryClient = useQueryClient();
    const {
        status,
        error,
        data: posts
    } = useQuery({
        queryKey: [`user:${user}`],
        queryFn: async () => {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                navigate('/login')
            }
            const response = await axios.get(`${url}/post/authorAllPosts`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "authToken": JSON.parse(token)
                }
            })
            return response.data;
        }
    })

    const handleDeletePost = async () => {
        const res = await deletePost({ id: refToDeletPost });
        if (res.status == 'success') {
            await queryClient.invalidateQueries([`user:${user}`]);
            queryClient.invalidateQueries([`allPosts`])
            queryClient.invalidateQueries([`featured`]);
            queryClient.invalidateQueries([`posts`]);
        }
    }
    if (status == 'pending') return <BallTriangle
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
    return (
        <div className='up-container'>
            <Navbar color='#232536' />
            <div className="upc-top">
                <div className='upct-h2'>Here your all posts will be available.</div>
                <div className='upct-h3'>You can manage your posts or create new post.</div>
                <div className='upct-h2'>No operation is undoable,so be carefull.</div>
            </div>
            <div className="upc-posts">
                <h2>All Posts</h2>
                {posts.length > 0 ?
                    posts.map((post, ind) => (
                        <div className='upc-single-post' key={post._id}>

                            <img src={`data:${post.contentType};base64,${post.base64}`} alt={post.name} className='upc-post-img' />
                            <div className='upc-post-cat'>
                                <div className="up-category">{post.category.toUpperCase()} </div>
                                <div className="icon" onClick={() => navigate(`/updatePost/${post._id}`)}>{<FaRegEdit size={20} />}</div>
                                <div className="icon" onClick={() => {
                                    refToDeletPost.current = post._id
                                    handleDeletePost();
                                }}>{<AiOutlineDelete size={20} />}</div>
                            </div>
                            <div className='upc-post-headline' onClick={() => navigate(`/post/${post._id}`
                                , { state: { category: post.category } })}>{post.topic} </div>
                        </div>
                    ))
                    :
                    <h2>No Post To show.</h2>
                }
            </div>
            <Footer />
        </div>
    )
}
