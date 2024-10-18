import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion, transform } from 'framer-motion';
import JoditEditor from 'jodit-react';
import "./CreatePost.css"
import Navbar from '../../components/navbar/Navbar';
import { editPost, uploadPost } from '../../utils/postUtilFunctions';
import Alert from '../../components/alert/Alert';
import {authContext} from '../../context/authContext.js'
export default function CreatePost() {
    //variables.
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [postDescription, setPostDescription] = useState("");
    const [postTopic, setPostTopic] = useState("");
    const [postCategory, setPostCategory] = useState("");
    const [expandCatInput, setExpandCatInput] = useState(false);
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [alert, setAlert] = useState(false);
    const {user} = useContext(authContext);
    const [alertContent, setAlertContent] = useState
        ({
            alertHeadline: "",
            alertMSG: ''
        })
    const [catItemsAnimate, setCatItemsAnimate] = useState
        ({
            flexDir: "row",
            left: "20px",
            top: "0px",

        })
        const queryClient = useQueryClient();
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
        const res = await uploadPost({ file, postTopic, postDescription, postCategory });
        setAlert(true);
        setAlertContent({
           alertHeadline:res.status,
           alertMSG:res.msg
        })
        return res.status;
    }

    const handleEditPost = async () => {
        const res = await editPost({ id, postTopic, postDescription, file, postCategory });
        setAlert(true);
        setAlertContent({
           alertHeadline:res.status,
           alertMSG:res.msg
        })
        return res.status
    }
    const handleSubmit = () => {
        let status;
        if (id) {
            status = handleEditPost();
        }
        else {
            status = handleUpload();
        }
        //invalidating the cache for fetching new updated data and then cache it.
        if(status == 'success'){
            queryClient.invalidateQueries([`user${user}`]);
            queryClient.invalidateQueries([`allPosts`]);
            queryClient.invalidateQueries([`featured`]);
            queryClient.invalidateQueries([`posts`]);
        }
    }
    console.log(id);
    if(alert) return <Alert setAlert={setAlert} alertContent={alertContent}  />
    return (
        <div className='create-post-section'>
            <Navbar color='#232536' />
            <div className='inputs'>
                <div className='topic cp-inputs'>
                    <label className='t-label'>Topic:</label>
                    <input type='text' className='topic-input'
                        onChange={(e) => setPostTopic(e.target.value)}
                    />
                </div>
                <div className='cat cp-inputs' onClick=
                    {() => setExpandCatInput(!expandCatInput)}>
                    <label className='c-label' >{postCategory.length != 0 ? postCategory : 'Category:'}</label>
                    <motion.div type='text' className='cat-input'
                        placeholder=' Blog Category'

                        transition={{ type: 'tween', duration: .5 }}
                        style={{ flexDirection: catItemsAnimate.flexDir }}>
                        <motion.span
                            initial={{ opacity: 0, position: 'relative', }}
                            animate={expandCatInput ?
                                { opacity: 1, top: catItemsAnimate.top, left: catItemsAnimate.left }
                                : {}}
                            transition={{ type: 'keyframes', duration: .5 }}
                            className={`cat-item ${postCategory == 'business' ? 'selected-cat-item' : ''}`}
                            onClick={() => {
                                setPostCategory('business');
                            }}>Business</motion.span>
                        <motion.span
                            initial={{ opacity: 0, position: 'relative', }}
                            animate={expandCatInput ? { opacity: 1, top: catItemsAnimate.top, left: catItemsAnimate.left } : {}}
                            transition={{ type: 'tween', duration: .5 }}
                            className={`cat-item ${postCategory == 'technology' ? 'selected-cat-item' : ''}`}
                            onClick={() => {
                                setPostCategory('technology');
                            }}>Technology</motion.span>
                        <motion.span
                            initial={{ opacity: 0, position: 'relative', }}
                            animate={expandCatInput ? { opacity: 1, top: catItemsAnimate.top, left: catItemsAnimate.left } : {}}
                            transition={{ type: 'tween', duration: .5 }}
                            className={`cat-item ${postCategory == 'lifecycle' ? 'selected-cat-item' : ''}`}
                            onClick={() => {
                                setPostCategory('lifecycle');
                            }}>Lifestyle</motion.span>
                        <motion.span
                            initial={{ opacity: 0, position: 'relative', }}
                            animate={expandCatInput ? { opacity: 1, top: catItemsAnimate.top, left: catItemsAnimate.left } : {}}
                            transition={{ type: 'spring', duration: .5 }}
                            className={`cat-item ${postCategory == 'sports' ? 'selected-cat-item' : ''}`}
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
                        style={{ transform: 'scale(1.4)' }}
                    />
                </div>
                <div className='file cp-inputs'>
                    <label className='f-label'>File</label>
                    <input type='file' className='file-input' onChange={handlefile} placeholder='no file' >
                    </input>
                </div>
                <div className='btn-container'>
                    <button onClick={handleSubmit} className='upload-btn'>Post</button>
                    <button onClick={() => navigate("/")} className='cancel-btn'>Cancel</button>
                </div>

            </div>
        </div>

    )
}
