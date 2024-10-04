import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import truncate from 'html-truncate';
import { FaRegCommentDots } from "react-icons/fa";//icons
import { BiLike, BiSolidLike } from "react-icons/bi";
import { BallTriangle } from 'react-loader-spinner';
import business from "../../assets/business.png";
import sports from "../../assets/sports.png";
import lifestyle from "../../assets/lifstyle.png";
import technology from "../../assets/technology.png";
import "./Posts.css"
import Footer from "../../components/footer/Footer.jsx"
import { authContext } from '../../context/authContext';//user context.
import Navbar from '../../components/navbar/Navbar.jsx';
import { fetchAllPost } from '../../utils/postUtilFunctions.js';
export default function Posts() {
    //variables.
    const navigate = useNavigate();
    const ref = useRef(null);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const { user } = useContext(authContext)
    const {
        status: status1,
        error: error1,
        data: allPostsData
    } = useQuery({
        queryKey: ["allPosts"],
        queryFn:  () => fetchAllPost("")
    });
    const {
        status: status2,
        error: error2,
        data: featuredPost
    } = useQuery({
        queryKey: ["featuredPost"],
        queryFn: () => fetchAllPost(`?featured=true`)
    });
    if (status1 === 'pending' || status2 === 'pending') return <h1>Loading...</h1>
    if (status1 === 'error' || status2 === 'error') return <h1>Error happened in fetching data.</h1>

    return (
        <div className='posts-container' >
            <Navbar color= 'black' />
            <div className="header-section">
                <div className="featured-post">
                    <div className="featured-left">
                        <span>FEATURED POST</span>
                        <div className='featured-topic'>{featuredPost.topic}</div>
                        <div >
                            <span>By</span>
                            <span className='featured-user'>{featuredPost.user}</span>
                            <span className='post-date'> {"| "}{featuredPost?.date?.toLocaleDateString('en-US', options) ||
                                new Date().toLocaleDateString('en-US', options)}</span>
                        </div>
                        <div className="featured-desc"
                            dangerouslySetInnerHTML={{ __html: truncate(featuredPost.description, 200) }}>
                        </div>
                        <button className='featured-btn'
                            onClick={() => navigate(`/post/${featuredPost._id}`,
                                { state: { category: featuredPost.category } }
                            )}>Read More {" >"}</button>
                    </div>
                    <div className="featured-right">
                        <img src={`data:${featuredPost.contentType};base64,${featuredPost.base64}`} alt={featuredPost.name} className='featured-img' />
                    </div>
                </div>
            </div>
            <div className='posts-section' >
                <h3>All Posts</h3>
                <div className="ps-posts">
                    {allPostsData.length > 0 ?
                        allPostsData.map((post, ind) => (
                            <div className="ps-post" key={ind}>
                                <div className="ps-post-left">
                                    <img src={`data:${post.contentType};base64,${post.base64}`} alt={post.name} className='ps-post-img' />
                                </div>
                                <div className="ps-post-right" onClick={() => navigate(`/post/${post._id}`, { state: { category: post.category } })}>
                                    <div className="ps-post-category">{post.category?.toUpperCase()}</div>
                                    <div className="ps-post-topic">{post.topic}</div>
                                    <div className="ps-post-desc"
                                        dangerouslySetInnerHTML={{ __html: truncate(post.description, 200) }}></div>
                                </div>
                            </div>
                        ))
                        :
                        <div className="no-post">
                            <h3>No Blog For This Category.</h3>
                        </div>
                    }
                </div>
            </div>
            <div className="categories">
                <h2 className='cat-heading'>All Categories</h2>
                <div className="all-cat">
                    <div className="category" onClick={() => navigate(`/blogs/business`)}>
                        <div className="cat-icon1">
                            <img className='icon1' src={business} alt='business' />
                        </div>
                        <div className="cat-name">Business</div>
                        <div className="cat-desc"> Essential Strategies and Insights for Thriving in Today's Business World</div>
                    </div>
                    <div className="category" onClick={() => navigate(`/blogs/sports`)}>
                        <div className="cat-icon2">
                            <img className='icon2' src={sports} alt='sports' />
                        </div>
                        <div className="cat-name">Sports</div>
                        <div className="cat-desc"> Highlights, Training, and Insights from the World of Sports</div>
                    </div>
                    <div className="category" onClick={() => navigate("/blogs/technology")}>
                        <div className="cat-icon3">
                            <img className='icon3' src={technology} alt='technology' />
                        </div>
                        <div className="cat-name">Technology</div>
                        <div className="cat-desc">The Latest Breakthroughs and Trends in Technology</div>
                    </div>
                    <div className="category" onClick={() => navigate("/blogs/lifestyle")}>
                        <div className="cat-icon4">
                            <img className='icon4' src={lifestyle} alt='lifestyle' />
                        </div>
                        <div className="cat-name">LifeStyle</div>
                        <div className="cat-desc">Tips and Trends for a Healthier, Happier Lifestyle</div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}


