import axios from 'axios';
import { useScroll } from 'framer-motion';
import React, { useEffect, useState, useCallback } from 'react'
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
  const location = useLocation();
  const category = location.state.category;
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
  const url = `${process.env.REACT_APP_HOST}/post`
  const fetchAllfiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/${postId}`);
      const response2 = await axios.get(`${url}/allPosts?limit=4&&category=${category}&&id=${postId}`)
      setPost(response.data)
      setPostsNextToRead(response2.data);
      switch (response.data.category) {
        case "sports":
          setPostCatIcon(sports);
          break;
        case "technology":
          setPostCatIcon(technology);
          break;
        case "business":
          setPostCatIcon(business);
          break;
        default:
          setPostCatIcon(lifestyle);
          break;
      }
    }
    catch (error) {
      console.error('Error fetching files:', error);
      alert(error)
    }
    finally {
      setLoading(false);
    }
  },[postId])
  useEffect(() => {
    fetchAllfiles();
  }, [postId])
  console.log(postsNextToRead)
  console.log(category)
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
              <img className='user-img' src={`https://avatar.iran.liara.run/public/boy?username=${post?.user}`} alt='USER' />
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
              <span > {post?.category.toUpperCase()}</span>
            </div>
          </div>
          <div className='middle-p-img'>
            <img src={`data:${post?.contentType};base64,${post.base64}`} alt={post?.name} className='post-img' />
          </div>
          <div className="bottom-p-desc"
            dangerouslySetInnerHTML={{ __html: post?.description }}>

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
