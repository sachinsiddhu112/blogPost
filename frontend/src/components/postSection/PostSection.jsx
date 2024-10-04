import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import "./PostSection.css";
import truncate from 'html-truncate';
import { motion, useScroll, useTransform } from 'framer-motion';
import business from "../../assets/business.png";
import sports from "../../assets/sports.png";
import lifestyle from "../../assets/lifstyle.png";
import technology from "../../assets/technology.png";
import storyBg from "../../assets/story-bg.png";
import { useNavigate } from 'react-router-dom';
import Category from '../../pages/category/Category';
import { fetchAllPost } from '../../utils/postUtilFunctions';
export default function PostSection() {

    const navigate = useNavigate();
    const date = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const {
        status: status1,
        error: error1,
        data: posts
    } = useQuery({
        queryKey: ["posts"],
        queryFn: () => fetchAllPost(`?limit=5`)
    });
    const {
        status: status2,
        error: error2,
        data: featuredPost
    } = useQuery({
        queryKey: ["featuredPost"],
        queryFn: () => fetchAllPost(`?featured=true`)
    });
    console.log(status1)
    if (status1 === 'pending' || status2 === 'pending') return <h1>Loading...</h1>
    if (status1 === 'error' || status2 === 'error') return <h1>Error happend in fetching data.</h1>
    
    return (
        <div className=''>
            <div className='ps-container' >
                <div className="left-section">
                    <h2>Featured Post</h2>
                    <img className='fp-img' src={`data:${featuredPost.contentType};base64,${featuredPost.base64}`} />
                    <div className=''>
                        <span>By</span>
                        <span className='post-user'>{featuredPost.user}</span>
                    </div>
                    <div className='post-topic'>{featuredPost.topic}</div>

                    <button className='fp-btn' onClick={() => navigate(`/post/${featuredPost._id}`,
                        { state: { category: featuredPost.category } }
                    )}>Read More{" >"}</button>
                </div>
                <div className="right-section">
                    <h2>All Posts</h2>
                    <div className="all-posts">
                        {
                            posts?.map((post) => (
                                <div className="single-post" key={post._id}>
                                    <div>
                                        <span>By</span>
                                        <span className='sp-post-user'>
                                            {post?.user}</span>
                                        <span className='sp-post-date'> {"| "}{post?.date?.toLocaleDateString('en-US', options) ||
                                            date.toLocaleDateString('en-US', options)}</span>
                                    </div>
                                    <div className='sp-post-headline' onClick={() =>
                                        navigate(`/post/${post?._id}`
                                            , { state: { category: post.category } }
                                        )}>{post?.topic}</div>

                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
            <div className="about-us-section">
                <div className="us-section-top">
                    <div className="orange-part"></div>
                    <div className='purple-part'></div>
                </div>
                <div className="content-section">
                    <div className="cs-left">
                        <span className='cs-heading'>ABOUT US</span>
                        <div className='cs-left-headline'>We are community of content writers who share their learnings.</div>
                        <div>We are a vibrant community of content writers who come together to share our learnings and experiences. Through collaboration and knowledge exchange, we aim to uplift one another, improve our craft, and inspire creative growth. Whether you're a seasoned writer or just starting out, our community fosters a supportive environment where everyone can learn, contribute, and thrive.
                        </div>
                        <span className='readmore'>Read More {" >"}</span>
                    </div>
                    <div className="cs-right">
                        <span className='cs-heading'>OUR MISSION</span>
                        <div className='cs-right-headline'>Creating valuable content for creatives all around world.</div>
                        <div>We are dedicated to creating valuable content for creatives across the globe. Our goal is to inspire, educate, and empower artists, designers, and creators by providing insightful resources, tips, and stories. Whether through tutorials, guides, or inspirational pieces, we strive to fuel the creative journeys of individuals everywhere, helping them unlock their full potential.</div>
                    </div>
                </div>
            </div>
            <div className="categories">
                <h2 className='cat-heading'>All Categories</h2>
                <div className="all-cat">
                    <div className="category">
                        <div className="cat-icon1">
                            <img className='icon1' src={business} alt='business' />
                        </div>
                        <div className="cat-name">Business</div>
                        <div className="cat-desc"> Essential Strategies and Insights for Thriving in Today's Business World</div>
                    </div>
                    <div className="category">
                        <div className="cat-icon2">
                            <img className='icon2' src={sports} alt='sports' />
                        </div>
                        <div className="cat-name">Sports</div>
                        <div className="cat-desc"> Highlights, Training, and Insights from the World of Sports</div>
                    </div>
                    <div className="category">
                        <div className="cat-icon3">
                            <img className='icon3' src={technology} alt='technology' />
                        </div>
                        <div className="cat-name">Technology</div>
                        <div className="cat-desc">The Latest Breakthroughs and Trends in Technology</div>
                    </div>
                    <div className="category">
                        <div className="cat-icon4">
                            <img className='icon4' src={lifestyle} alt='lifestyle' />
                        </div>
                        <div className="cat-name">LifeStyle</div>
                        <div className="cat-desc">Tips and Trends for a Healthier, Happier Lifestyle</div>
                    </div>
                </div>
            </div>
            <div className="our-story">
                <div className="story-bg">
                    <img src={storyBg} className='story-img' />
                </div>
                <div className="story-details">
                    <span className='st-heading'>WHY WE STARTED</span>
                    <div className='st-headline'>It started out as simple idea and evolved into our passion</div>
                    <div className='story-desc'>
                        What started as casual personal reflections grew into a powerful platform for self-expression, education, and even careers.Today, blogging has become a passion for many, allowing individuals to connect with others, influence opinions, and make an impact through their unique voices. It's now a tool for both personal growth and professional success.
                    </div>
                    <button className='read-story'>Discover Our Story{" >"}</button>
                </div>
            </div>
        </div>
    )
}
