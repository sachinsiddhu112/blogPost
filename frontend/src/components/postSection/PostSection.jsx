import React, { useState, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import "./PostSection.css";
import { BallTriangle } from 'react-loader-spinner';
import storyBg from "../../assets/story-bg.png";
import { useNavigate } from 'react-router-dom';
import { fetchAllPost, formateDate } from '../../utils/postUtilFunctions';
import { categories } from '../../utils/utilData';
import { useWindowWidth } from '../../hooks/windowWidth';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { next, prev } from '../../utils/utilData.js'
export default function PostSection() {
    const { mobileWindow } = useWindowWidth();
    const navigate = useNavigate();
    const [indexOfCategory, setIndexOfCategory] = useState(0);
    const startPos = useRef(-200);
    const [indexOfPost, setIndexOfPost] = useState(0);
    const swipeHanlers = useSwipeable({
        onSwipedLeft: () => next(setIndexOfPost, indexOfPost, posts, startPos),
        onSwipedRight: () => prev(setIndexOfPost, indexOfPost, posts, startPos)
    })
    const {
        status: status1,
        error: error1,
        data: posts
    } = useQuery({
        queryKey: ["post","posts:public"],
        queryFn: () => fetchAllPost(`/allPosts?limit=4&&featured=false`)
    });
    const {
        status: status2,
        error: error2,
        data: featuredPost
    } = useQuery({
        queryKey: ["post","featuredPost"],
        queryFn: () => fetchAllPost(`/allPosts?featured=true`)
    });

   
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
    if (status1 === 'error' || status2 === 'error') return <h1>Error happend in fetching data.</h1>
    return (
        <div style={{ width: '100%', maxWidth: '2400px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <div className='ps-container' >
                <div className="left-section">
                    <span style={{ fontSize: '22px' }} >Featured Post</span>
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
                    <span style={{ fontSize: '22px' }}>All Posts</span>
                    <div className="all-posts">
                        {!mobileWindow ?
                            posts?.map((post) => (
                                <div className="single-post" key={post._id} onClick={() =>
                                    navigate(`/post/${post?._id}`
                                        , { state: { category: post.category } }
                                    )}>
                                    <div>
                                        <span>By</span>
                                        <span className='sp-post-user'>
                                            {" "}{post?.user}</span>
                                        <span className='sp-post-date'> {" | "}{new Date(post?.date).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className='sp-post-headline' > {post?.topic.substring
                                        ( 0, post?.topic.length < 65 ?
                                         post.topic.length : 65 )}{"..."}</div>

                                </div>
                            ))
                            :
                            <div className="mb-post-container">
                                <motion.div className="single-post"
                                    initial={{ x: startPos.current, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 2, type: 'spring' }}
                                    {...swipeHanlers}
                                    key={posts[indexOfPost]._id} onClick={() =>
                                        navigate(`/post/${posts[indexOfPost]?._id}`
                                            , { state: { category: posts[indexOfPost].category } }
                                        )}>
                                    <div>
                                        <span>By</span>
                                        <span className='sp-post-user'>
                                            {" "}{posts[indexOfPost]?.user}</span>
                                        <span className='sp-post-date'> {" | "}{new Date(posts[indexOfPost]?.date).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className='sp-post-headline' >
                                        {posts[indexOfPost]?.topic.substring
                                        ( 0, posts[indexOfPost].topic.length < 65 ?
                                         posts[indexOfPost].topic.length : 65 )}{"..."}
                                         </div>
                                </motion.div>
                                <div className="dot-container">
                                    {
                                        posts.map((post, index) => (
                                            <span key={`index${index}`} className={`dot 
                                                ${index == indexOfPost ? 'selectedPost' : " "}`}></span>
                                        ))
                                    }
                                </div>
                            </div>
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
                        <div style={{ textAlign: 'justify' }} className='about-us-desc'>We are a vibrant community of content writers who come together to share our learnings and experiences.
                        </div>

                    </div>
                    <div className="cs-right">
                        <span className='cs-heading'>OUR MISSION</span>
                        <div className='cs-right-headline'>Creating valuable content for creatives all around world.</div>
                        <div style={{ textAlign: 'justify' }} className='about-us-desc'>We are dedicated to creating valuable content for creatives across the globe.  </div>
                    </div>
                </div>
            </div>
            <div className="categories">
                <h2 className='cat-heading'>All Categories</h2>
                {!mobileWindow ?
                    <div className="all-cat">
                        {
                            categories.map((category, i) => (
                                <div className="category" key={category.name}>
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
                    <div className="all-cat">
                        <motion.div
                            initial={{ x: startPos.current, opacity: 0 }}
                            whileInView={{x:0,opacity:1}}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 2, type: 'spring' }}
                            className="category" key={categories[indexOfCategory].name}>
                            <div className={`cat-icon${indexOfCategory + 1}`}>
                                <img className={`icon${indexOfCategory + 1}`} src={categories[indexOfCategory].icon} alt='sports' />
                            </div>
                            <div className="cat-name">{categories[indexOfCategory].name}</div>
                            <div className="cat-desc">{categories[indexOfCategory].desc}</div>
                        </motion.div>
                        <div className="toggleBtns">
                            <span className='cat-np-btn' onClick={() =>
                                prev(setIndexOfCategory, indexOfCategory, categories, startPos)
                             } >{"<"}</span>
                            <span className='cat-np-btn' onClick={() => 
                                next(setIndexOfCategory, indexOfCategory, categories, startPos)}>{">"}</span>
                        </div>
                    </div>
                }
            </div>
            <div className="our-story">
                <div className="story-bg">
                    <img src={storyBg} className='story-image' />
                </div>
                <div className="story-details">
                    <span className='st-heading'>WHY WE STARTED!</span>
                    {!mobileWindow && <div className='st-headline'>It startPosed out as simple idea and evolved into our passion</div>}
                   
                        <div className='story-desc'>
                            What startPosed as casual personal reflections grew into a powerful platform for self-expression, education, and even careers.
                        </div>

                </div>
            </div>
        </div>
    )
}
