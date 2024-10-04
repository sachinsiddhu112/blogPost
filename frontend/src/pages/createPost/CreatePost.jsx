import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import JoditEditor from 'jodit-react';
import "./CreatePost.css"
import Navbar from '../../components/navbar/Navbar';
export default function CreatePost() {
    //variables.
    const [file, setFile] = useState(null);
    const [postDescription, setPostDescription] = useState("");
    const [postTopic, setPostTopic] = useState("");
    const [postCategory, setPostCategory] = useState("");
    const [expandCatInput, setExpandCatInput] = useState(false);
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [catItemsAnimate, setCatItemsAnimate] = useState({
        flexDir: "row",
        left: "20px",
        top: "0px",

    })
    const url = `${process.env.REACT_APP_HOST}/post`
    useEffect(() => {
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            if (width <= 767) {
                // Mobile screen (e.g., phones)
                setCatItemsAnimate({
                    left: "0px",
                    top: "15px",
                    flexDir: "column",
                })
            } else {
                // Desktop screen
                setCatItemsAnimate({
                    top: '0px',
                    left: "20px",
                    flexDir: "row",

                })
            }
        })
        return () => {
            window.removeEventListener('resize', () => { })
        }
    }, [window.innerWidth])
    //function to handle file while selecting the file for uploading with blog.
    const handlefile = (e) => {
        setFile(e.target.files[0]);
    }
    //function to upload the blog .
    const handleUpload = async () => {
        //input check while uploading the blog.
        if (!file || !postTopic || !postDescription || !postCategory) {
            alert("Fill all detials before posting your blog.")
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', postDescription);
        formData.append("topic", postTopic);
        formData.append('category', postCategory)
   
        try {
            const response = await axios.post(`${url}upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authToken': JSON.parse(sessionStorage.getItem("authToken"))
                },
            });
            alert('file uploaded successfully');
            navigate("/");
        }
        catch (err) {
            console.log(err);
            alert(err.response.data.error);
        }
    }

    console.log(expandCatInput)
    console.log(postCategory)
    return (
        <div className='create-post-section'>
            <Navbar />
            <div className='inputs'>
                <div className='topic cp-inputs'>
                    <label className='t-label'>Topic</label>
                    <input type='text' className='topic-input'
                        onChange={(e) => setPostTopic(e.target.value)}
                        placeholder=' Blog topic' />
                </div>
                <div className='cat cp-inputs' >
                    <label className='c-label'>Category</label>
                    <motion.div type='text' className='cat-input'
                        placeholder=' Blog Category' onClick=
                        {() => setExpandCatInput(true)}

                        transition={{ type: 'tween', duration: .5 }}
                        style={{ flexDirection: catItemsAnimate.flexDir }}>
                        <motion.span
                            initial={{ opacity: 0, position: 'relative', }}
                            animate={expandCatInput ?
                                { opacity: 1, top: catItemsAnimate.top, left: catItemsAnimate.left }
                                : { }}
                            transition={{ type: 'keyframes', duration: .5 }}
                            className={`cat-item ${postCategory == 'business'?'selected-cat-item':''}`}
                            onClick={() => {
                                setPostCategory('business');
                            }}>Business</motion.span>
                        <motion.span
                            initial={{ opacity: 0, position: 'relative', }}
                            animate={expandCatInput ? { opacity: 1, top: catItemsAnimate.top, left: catItemsAnimate.left } : { }}
                            transition={{ type: 'tween', duration: .5 }}
                            className={`cat-item ${postCategory == 'technology'?'selected-cat-item':''}`}
                            onClick={() => {
                                setPostCategory('technology');
                            }}>Technology</motion.span>
                        <motion.span
                            initial={{ opacity: 0, position: 'relative', }}
                            animate={expandCatInput ? { opacity: 1, top: catItemsAnimate.top, left: catItemsAnimate.left } : { }}
                            transition={{ type: 'tween', duration: .5 }}
                            className={`cat-item ${postCategory == 'lifecycle'?'selected-cat-item':''}`}
                            onClick={() => {
                                setPostCategory('lifecycle');
                            }}>Lifestyle</motion.span>
                        <motion.span
                            initial={{ opacity: 0, position: 'relative', }}
                            animate={expandCatInput ? { opacity: 1, top: catItemsAnimate.top, left: catItemsAnimate.left } : { }}
                            transition={{ type: 'spring', duration: .5 }}
                            className={`cat-item ${postCategory == 'sports'?'selected-cat-item':''}`}
                            onClick={() => {
                                setPostCategory('sports');
                            }}>Sports</motion.span>

                    </motion.div>
                </div>
                <div className='description cp-inputs'>
                    <label className='d-label' >Description</label>
                    <JoditEditor
                        ref={editorRef}
                        value={postDescription}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newDescription => setPostDescription(newDescription)}
                        onChange={newDescription => { }}
                        className='description'
                    />
                </div>
                <div className='file cp-inputs'>
                    <label className='f-label'>File</label>
                    <input type='file' className='file-input' onChange={handlefile} placeholder='no file' >
                    </input>
                </div>
                <div className='btn-container'>
                    <button onClick={handleUpload} className='upload-btn'>Post</button>
                    <button onClick={() => navigate("/")} className='cancel-btn'>Cancel</button>
                </div>

            </div>
        </div>

    )
}
