import React, { useEffect, useState } from 'react'
import axios from 'axios';
import truncate from 'html-truncate';
import { BallTriangle } from 'react-loader-spinner';
import business from "../../assets/business.png";
import sports from "../../assets/sports.png";
import lifestyle from "../../assets/lifstyle.png";
import technology from "../../assets/technology.png";
import "./Category.css";
import Navbar from '../../components/navbar/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
export default function Category() {
    const { category } = useParams();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const url = `${process.env.REACT_APP_HOST}/post/allPosts`
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${url}?category=${category}`);
                setPosts(response.data);
            }
            catch (err) {
                alert(err)
            }
            finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, [category])
    console.log(posts);
    return (
        <div className='c-container'>
            <Navbar />
            {
                !loading ?
            <div style={{width:"100%"}}>
                <div className="header-section">
                    <div className="header-heading">
                        {category.toUpperCase()}
                    </div>
                    <div className="header-desc">
                        <div>Welcome to our category page!</div> 
                        <div>Here, you'll find a curated selection of  tailored content   </div>
                        <div>  Browse through our collection to discover insightful articles, tips, and resources. </div>
                    </div>
                    <div className="header-route">
                        <span className='item-a'>BLOG</span>
                        <span className='item-b'>{">"}</span>
                        <span className='item-a'>{category.toUpperCase()}</span>
                    </div>
                </div>
                <div className="c-content-section">
                    <div className="category-posts">
                        {posts.length > 0 ?
                            posts.map((post, ind) => (
                                <div className="cat-post" key={ind}>
                                    <img src={`data:${post.contentType};base64,${post.base64}`} alt={post.name} className='cat-post-img' />
                                    <div className="post-details">
                                        <div className="pd-category">{post.category.toUpperCase()}</div>
                                        <div className="pd-headline" onClick={() => navigate(`/post/${post._id}`)}>{post.topic}</div>
                                        <div className="pd-desc"
                                         dangerouslySetInnerHTML={{ __html: truncate(post.description,100) }}></div>
                                    </div>
                                </div>
                            ))
                            :
                            <h2 className="no-post">No Post For This Category.</h2>
                        }
                    </div>
                    <div className="all-categories">
                        <span className='al-headline'>Categories</span>
                        <div className='al-item'>
                            <div className='icon-wrapper'>
                                <img src={technology} className='al-item-icona' alt="" />
                            </div>
                            <span className="al-item-name" onClick={() => navigate("/blogs/technology")}>Technology</span>
                        </div>
                        <div className='al-item' onClick={() => navigate("/blogs/business")}>
                            <div className='icon-wrapper'>
                                <img src={business} className='al-item-icona' alt="" />
                            </div>
                            <span className="al-item-name" >Business</span>
                        </div>
                        <div className='al-item' onClick={() => navigate('/blogs/sports')} >
                            <div className='icon-wrapper'>
                                <img src={sports} className='al-item-iconb' alt="" />
                            </div>
                            <span className="al-item-name">Sports</span>
                        </div>
                        <div className='al-item' onClick={() => navigate("/blogs/lifestyle")}>
                            <div className='icon-wrapper'>
                                <img src={lifestyle} className='al-item-iconb' alt="" />
                            </div>
                            <span className="al-item-name">Lifestyle</span>
                        </div>
                    </div>
                </div>
            </div>
            : 
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
        }
            <Footer />
        </div>
    )
}
