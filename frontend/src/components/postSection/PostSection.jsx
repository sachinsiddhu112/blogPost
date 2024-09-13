import React, { useEffect, useState, useRef } from 'react'
import "./PostSection.css";
import axios from 'axios';
import { motion, useScroll, useTransform } from 'framer-motion';
import business from "../../assets/business.png";
import sports from "../../assets/sports.png";
import lifestyle from "../../assets/lifstyle.png";
import technology from "../../assets/technology.png";
import storyBg from "../../assets/story-bg.png";
import { useNavigate } from 'react-router-dom';
export default function PostSection() {
    const [featuredPost, setFeaturedPost] = useState({
        user: 'SachinSiddhu',
        topic: "general",
        description: "",
        comments: [],
        likes: [],
        contentType: "image",
        base64: "",
    })
    const navigate = useNavigate();
    const date = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [postBase64Data, setPostBase64Data] = useState("");
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    })
    const scaleY = useTransform(scrollYProgress, [0, 1], [.3, 1]);


    useEffect(() => {
        try {
            const fetchAllPost = async () => {
                setLoading(true);
                //fetching all posts.
                const response = await axios.get(`${process.env.REACT_APP_HOST}/post/allPosts?limit=6`);
                setPosts(response.data);
                //fetching featured post.
                const response2 = await axios.get(`${process.env.REACT_APP_HOST}/post/allPosts?featured=true`);
                setFeaturedPost(response2.data);
                const base64Data = `data:${response2.data.contentType};base64,${response2.data.base64}`;
                setPostBase64Data(base64Data)
                setLoading(false);
            }

            fetchAllPost();
            //fetchFeaturedPost();
        }
        catch (error) {
            alert(error.response.data.error);
        }

    }, [])
    console.log(posts)
    return (
        <div className=''>
            {!loading && 
            <div className='ps-container' >
                <div className="left-section">
                    <h2>Featured Post</h2>
                    <img className='fp-img' src={postBase64Data} />
                    <div className=''>
                        <span>By</span>
                        <span className='post-user'>{featuredPost.user}</span>
                    </div>
                    <div className='post-topic'>{featuredPost.topic}</div>
                    <span className='fp-desc'>{featuredPost.description.substring(0, 100)}</span>
                    <button className='fp-btn' onClick={() => navigate(`/post/${featuredPost._id}`)}>Read More{" >"}</button>
                </div>
                <div className="right-section">
                    <h2>All Posts</h2>
                    <div className="all-posts">
                        {
                            posts.map((post) => (
                                <div className="single-post" key={post._id}>
                                    <div>
                                        <span>By</span>
                                        <span className='sp-post-user'>
                                            {post.user}</span>
                                        <span className='sp-post-date'> {"| "}{post?.date?.toLocaleDateString('en-US', options) ||
                                            date.toLocaleDateString('en-US', options)}</span>
                                    </div>
                                    <div className='sp-post-headline' onClick={() =>
                                         navigate(`/post/${post._id}`)}>{post.topic}</div>

                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>}
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
