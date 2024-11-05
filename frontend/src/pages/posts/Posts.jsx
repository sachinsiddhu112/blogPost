import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import truncate from 'html-truncate';
import { motion } from 'framer-motion'
import { BallTriangle } from 'react-loader-spinner';
import "./Posts.css";
import { categories } from '../../utils/utilData';
import Footer from "../../components/footer/Footer.jsx"
import { authContext } from '../../context/authContext';//user context.
import Navbar from '../../components/navbar/Navbar.jsx';
import { fetchAllPost } from '../../utils/postUtilFunctions.js';
import { useWindowWidth } from "../../hooks/windowWidth.js";
export default function Posts() {
    //variables.
    const navigate = useNavigate();
    const ref = useRef(null);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const { user } = useContext(authContext)
    const [index, setIndex] = useState(0);
    const [postByStatus, setPostByStatus] = useState('public');
    const start = useRef(-200);
    const { mobileWindow } = useWindowWidth();
    const {
        status: status1,
        error: error1,
        data: allPostsData,
        refetch
    } = useQuery({
        queryKey: [`post","allPosts:${postByStatus}`],
        queryFn: () => fetchAllPost(`/allPosts?featured=false&&status=${postByStatus}`)
    });
    const {
        status: status2,
        error: error2,
        data: featuredPost
    } = useQuery({
        queryKey: ["post","featuredPost"],
        queryFn: () => fetchAllPost(`/allPosts?featured=true`)
    });

    useEffect(() => {
        refetch()
    },[postByStatus])
    const next = () => {
        console.log('next', index)
        start.current = 200;
        index < categories.length - 1 ? setIndex(index + 1) : setIndex(0);
    }
    const prev = () => {
        console.log('prev', index)
        start.current = -200;
        index == 0 ? setIndex(categories.length - 1) : setIndex(index - 1);
    }
    if (status1 === 'pending' || status2 === 'pending') return <BallTriangle
        height={200}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
    />
    if (status1 === 'error' || status2 === 'error') return <h1>Error happened in fetching data.</h1>

    return (
        <div className='posts-container' >
            <Navbar color='#232536' />
            <div className="header-section">
                {featuredPost ?
                    <div className="featured-post">
                        <div className="featured-left">
                            <span style={{ marginTop: '10px' }}>FEATURED POST</span>
                            <div className='featured-topic'>{featuredPost.topic}</div>
                            <div >
                                <span>By</span>
                                <span className='featured-user'>{featuredPost.user}</span>
                                <span className='post-date'>{" | "}{new Date(featuredPost?.date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}</span>
                            </div>
                            {!mobileWindow && <div className="featured-desc"
                                dangerouslySetInnerHTML={{ __html: truncate(featuredPost.description, 200) }}>
                            </div>}
                            <button className='featured-btn'
                                onClick={() => navigate(`/post/${featuredPost._id}`,
                                    { state: { category: featuredPost.category } }
                                )}>Read More {" >"}</button>
                        </div>
                        <div className="featured-right">
                            <img src={`data:${featuredPost.contentType};base64,${featuredPost.base64}`} alt={featuredPost.name} className='featured-img' />
                        </div>
                    </div>
                    :
                    <h2 style={{ fontStyle: 'italic', textDecoration: 'underline' }}>Currently No Featured Post!</h2>
                }
            </div>
            <div className='posts-section' >
                <h3 style={{fontSize:'24px'}}>All Posts</h3>
                <div className="post-status">
                    <div className={`pstatus-public ${postByStatus == 'public'? "post-status-highlight" : ""}`} 
                    onClick={() => setPostByStatus('public')}>Public</div>
                    <div className= {`pstatus-upcoming ${postByStatus == 'upcoming'? "post-status-highlight" : ""}`} 
                    onClick={() => setPostByStatus('upcoming')}>Upcoming</div>
                </div>
                <hr style={{width:'100%',height:'4px', color:'gray'}}/>
                {postByStatus == 'public' ?
                    <div
                    className={`ps-posts` }>
                    {allPostsData.length > 0 ?
                        allPostsData.map((post, ind) => (
                            <div className={`ps-post`} key={ind} onClick={() => navigate(`/post/${post._id}`, { state: { category: post.category } })}>
                                <div className="ps-post-left">
                                    <img src={`data:${post.contentType};base64,${post.base64}`} alt={post.name} className='ps-post-img' />
                                </div>
                                <div className="ps-post-right" >
                                    <div className="ps-post-category">{post.category?.toUpperCase()}</div>
                                    <div className="ps-post-topic">{post.topic}</div>
                                    {!mobileWindow && <div className="ps-post-desc"
                                        dangerouslySetInnerHTML={{ __html: truncate(post.description, 150) }}></div>}
                                </div>
                            </div>
                        ))
                        :
                        <div className="no-post">
                            <h3>No Blog To Show.</h3>
                        </div>
                    }
                    </div>
                    :
                    <div
                    className={`ps-posts `}
                    style={{alignItems:'flex-end'}}>
                       {allPostsData.length > 0 ?
                        allPostsData.map((post, ind) => (
                            <div className={`uuc-single-post`} key={ind}>
                               
                                    <div className="ps-post-category">{post.category?.toUpperCase()}</div>
                                    <div className="uuc-post-headline">{post.topic}</div>
                                
                            </div>
                        ))
                        :
                        <div className="no-post">
                            <h3>No Upcoming Blog To Show.</h3>
                        </div>
                    }
                    </div>  
                }
            </div>
            <div className="categories">
                <h2 className='cat-heading'>All Categories</h2>
                {!mobileWindow ?
                    <div className="posts.all-cat">
                        {
                            categories.map((category, i) => (
                                <div className="category" key={i}
                                onClick={() =>
                                navigate(`/blogs/${category.name.toLowerCase()}`)}>
                                    <div className={`cat-icon${i + 1}`}>
                                        <img className={`icon${i + 1}`} src={category.icon} alt='sports' />
                                    </div>
                                    <div className="cat-name">{category.name}</div>
                                    <div className="cat-desc">{category.desc}</div>
                                </div>
                            ))
                        }

                    </div>
                    :
                    <div className="posts-all-cat">
                        <motion.div
                            initial={{ x: start.current, opacity:0 }}
                            animate={{ x: 0, opacity:1 }}
                            transition={{ duration: 2, type: 'spring' }}
                            onClick={() =>
                                navigate(`/blogs/${categories[index].name.toLowerCase()}`, { state:{ category: categories[index].name.toLowerCase()} })}
                            className="category" key={index} style={{display:'flex', flexDirection:'column'}}>
                            <div className={`cat-icon${index + 1}`}>
                                <img className={`icon${index + 1}`} src={categories[index].icon} alt='sports' />
                            </div>
                            <div className="cat-name">{categories[index].name}</div>
                            <div className="cat-desc">{categories[index].desc}</div>
                        </motion.div>
                        <div className="toggleBtns">
                            <span className='cat-np-btn' onClick={prev}>{"<"}</span>
                            <span className='cat-np-btn' onClick={next}>{">"}</span>
                        </div>
                    </div>
                }
            </div>
            <Footer />
        </div>

    )
}


