import axios from 'axios';
import { useScroll } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BallTriangle } from 'react-loader-spinner';
import business from "../../assets/business.png";
import sports from "../../assets/sports.png";
import lifestyle from "../../assets/lifstyle.png";
import technology from "../../assets/technology.png";
import "./Post.css"
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
export default function Post() {
  const { id } = useParams();
  const [postId, setPostId] = useState(id);
  const { category } = useLocation();
  const navigate = useNavigate();
  const [postCatIcon, setPostCatIcon] = useState(business);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const [loading, setLoading] = useState(false);
  const [postsNextToRead, setPostsNextToRead] = useState([]);
  const [post, setPost] = useState({
    user: 'SachinSiddhu',
    topic: "general",
    description: "",
    comments: [],
    likes: [],
    category: "",
    contentType: "image",
    base64: "",
  })
  useEffect(() => {
    const fetchAllfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_HOST}/post/${postId}`);
        const response2 = await axios.get(`${process.env.REACT_APP_HOST}/post/allPosts?limit=3`)
        setPost(response.data)
        setPostsNextToRead(response2.data);
        response.data.category == 'sports' ?
          setPostCatIcon(sports) :
          response.data.category == 'technology' ?
            setPostCatIcon(technology) :
            response.data.category == 'business' ?
              setPostCatIcon(business) :
              setPostCatIcon(lifestyle);
      }
      catch (error) {
        console.error('Error fetching files:', error);
        alert(error)
      }
      finally {
        setLoading(false);
      }
    };
    fetchAllfiles();
  }, [postId])
  console.log(postsNextToRead)
  return (
    <div className='container'>
      <Navbar />
      {loading ?
        <div className="loader">
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
        </div> :
        <div className='post-container'>
          <div className="top-p-info">
            <div className="user">
              <img className='user-img' src={`https://avatar.iran.liara.run/public/boy?username=${post.user}`} alt='USER' />
              <div className='name-date'>
                <div className="name">
                  {post.user}
                </div>
                <div className="date">{post?.date?.toLocaleDateString('en-US', options) ||
                  new Date().toLocaleDateString('en-US', options)}</div>
              </div>
            </div>
            <div className="post-headline">
              {post.topic}
            </div>
            <div className="post-category">
              <img className='pc-icon' src={postCatIcon} alt="" />
              <span > {post.category.toUpperCase()}</span>
            </div>
          </div>
          <div className='middle-p-img'>
            <img src={`data:${post.contentType};base64,${post.base64}`} alt={post.name} className='post-img' />
          </div>
          <div className="bottom-p-desc">
            {post.description}
          </div>
          <div className="next-to-read">
            <div className='ntr-headline' >What To Read Next:</div>
            <div className="next-posts">
              {postsNextToRead.length > 0 ?
                postsNextToRead.map((post, ind) => (
                  <div className="n-post" key={ind}>
                    <img src={`data:${post.contentType};base64,${post.base64}`} alt={post.name} className='np-img' />
                    <div className="np-headline" onClick={() => setPostId(post._id)}>
                      {post.topic}:
                    </div>
                    <div className="np-desc">
                      {post.description.substring(0, 50)}...
                    </div>
                  </div>
                ))
                :
                <h3>No Post.</h3>
              }
            </div>
          </div>
        </div>}
      <Footer />
    </div>
  )
}
