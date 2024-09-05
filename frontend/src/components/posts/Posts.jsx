import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform} from 'framer-motion';
import { FaRegCommentDots } from "react-icons/fa";//icons
import { BiLike, BiSolidLike } from "react-icons/bi";
import { BallTriangle } from 'react-loader-spinner';
import articleImag from "../../assets/articleImag.jpg";
import documentImage from "../../assets/documentImage.jpg";
import multimediaImge from '../../assets/MultimediaImage.jpg';
import "./Posts.css"
import { authContext } from '../../context/authContext';//user context.
export default function Posts() {
    //variables.
    const navigate = useNavigate();
    const ref = useRef(null);
    const { user } = useContext(authContext)
    const [allPostsData, setAllPostsData] = useState([]);
    const [searchWithTopic, setSearchWithTopic] = useState(false);
    const [searchWithBlogger, setSearchWithBlogger] = useState(false);
    const [filteredData, setFilteredData] = useState(allPostsData);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);

    const { scrollYProgress } = useScroll({
        target:ref,
        offset:["0 1","1.2 1"]
    })
    const scalePost = useTransform(scrollYProgress,[0,.5,1],[.5,1,.5],{clamp:true})
    //useEffect to load data from backend.
    useEffect(() => {
        const fetchAllfiles = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://blog-post-backend.vercel.app/post/allPosts');
                setAllPostsData(response.data);
                setFilteredData(response.data);

            } catch (error) {
                console.error('Error fetching files:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchAllfiles();
    }, [])


    const createPost = () => {
        //checking user loged in or not.
         user ? navigate("/createPost") : alert("You have to login to create your blog.");
         return;
        }
    //function to search and filter the posts as per user choices(blogger or topic)
    const filterData = () => {

        if (!searchInput) {
            alert("Please provide something in search.")
            return;
        }
        if (!searchWithBlogger && !searchWithTopic) {
            alert("Please select one criteria,Blogger or Topic.");
            return;
        }
        else if (searchWithBlogger && !searchWithTopic) {
            const newData = allPostsData.filter((post) => {
                return post.user.toLowerCase().includes(searchInput);
            })
            if (newData.length == 0) {
                alert("No item to show.")
                return;
            }
            setFilteredData(newData);
        }
        else if (!searchWithBlogger && searchWithTopic) {
            const newData = allPostsData.filter((post) => {
                return post.topic.toLowerCase().includes(searchInput);
            })
            if (newData.length == 0) {
                alert("No item to show.");
                return;
            }
            setFilteredData(newData);
        }
        else if (searchWithBlogger && searchWithTopic) {
            alert("You cann't search with both.")
            return;
        }
    }

    const clearFilter = () => {
        setFilteredData(allPostsData)
        setSearchInput("")
        setSearchWithBlogger(false);
        setSearchWithTopic(false);
    }
    //rendering the file  section of each blog on web page,according to it's type(document,video,image).
    const renderFile = (file) => {
        const base64Data = `data:${file.contentType};base64,${file.base64}`;
        if (file.contentType.startsWith('image/')) {
            //file type img
            return <img src={base64Data} alt={file.name} className='all-posts-post-file' />;
        }
        else if (file.contentType.startsWith('video/')) {
            //file type video
            return <video controls src={base64Data} className='all-posts-post-file' />;
        }
        else if (file.contentType === 'application/pdf') {
            //file type pdf document.
            return (
                <embed src={base64Data} type="application/pdf" width="100%" height="600px" />
            );
        }
    }

    //function to provide filtered posts.
    const showPost = (post) => {
        return (
            <motion.div key={post._id} className='all-posts-post' 
           initial={{scale:.8}}
           whileInView={{scale:1}} 
           transition={{duration:1,type:'tween'}}>
                <div className='all-posts-post-details'
                    onClick={() => navigate(`/post/${post._id}`)}>
                    <div className='user-details'>
                        <img className="user-pic" src={`https://avatar.iran.liara.run/username?username=${post.user + post.user}`} alt='owner' />
                        <span className='user-name'>{post.user}</span>

                    </div>
                    <span className='p-tag'>{post.topic}</span>
                    <span className='p-desc'>{post.description.substring(0, 30)}...</span>
                    {renderFile(post)}
                </div>
                <div className='post-like-comment'>
                    <div className='post-like'>
                        <span >{
                            !post.likes.includes(user) ? <BiLike size={27}
                                onClick={() => {
                                    alert("Please visit the blog for like.")
                                }} /> :
                                <BiSolidLike size={27} />}</span>
                        <span>{post.likes.length}</span>
                    </div>
                    <div className="post-comment">
                        <span >{<FaRegCommentDots size={25}
                            onClick={() => {
                                alert("Please visit the blog for commenting.")
                            }} />}</span>
                        <span>{post.comments.length}</span>
                    </div>
                </div>
            </motion.div>
        )
    }
    return (
        <div className='post-container' >
            <div className='noNewPost'>
                <div className='noPost-postSection' >
                    <img src={`https://avatar.iran.liara.run/username?username=${user + user}`} alt="loading" />
                    <div className='newPostUpdater' onClick={createPost}>Create Your New Blog...</div>
                </div>
                <div className='noPost-infoSection'>
                    <div className='infoItem'>
                        <img src={multimediaImge} />
                        <span>Images</span>
                    </div>
                    <div className='infoItem'>
                        <img src={documentImage} />
                        <span>Documents</span>
                    </div>
                    <div className='infoItem'>
                        <img src={articleImag} />
                        <span>Ariticles</span>
                    </div>
                </div>
            </div>

            <div className='search-post' >
                <div className='search-bar'>
                    <input type='text' className='search-input' placeholder='search' value={searchInput} onChange={(e) => setSearchInput(e.target.value.toLowerCase())} />
                    <button className='search-btn' onClick={filterData}>Search</button>
                </div>
                <div className='search-selectors'>
                    <div className='search-selector'>
                        <span>Topic</span>
                        <input type='checkbox' className='search-by-topic' checked={searchWithTopic}
                            onChange={() => setSearchWithTopic((prev) => !prev)} />
                    </div>
                    <div className='search-selector'>
                        <span>Blogger</span>
                        <input type='checkbox' className='search-by-blogger' checked={searchWithBlogger}
                            onChange={() => setSearchWithBlogger((prev) => !prev)} />
                    </div>
                    <div className='search-selector'>
                        <button className='clear-btn' onClick={clearFilter}>Clear</button>
                    </div>
                </div>
            </div>
            {loading ?
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
                : <div className='all-posts' >
                    {filteredData.map((post, ind) => (
                        showPost(post)))
                    }
                </div>}
        </div>
    )
}


