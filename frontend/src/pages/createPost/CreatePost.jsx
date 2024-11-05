import React, { useState, useRef, useEffect, useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import JoditEditor from 'jodit-react';
import "./CreatePost.css"
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Navbar from '../../components/navbar/Navbar';
import { editPost, uploadPost } from '../../utils/postUtilFunctions';
import Alert from '../../components/alert/Alert';
export default function CreatePost() {
    //variables for updating the post..
    const { id } = useParams();
    const location = useLocation();
    const topic = location.state ? location.state.topic : "";
    const description = location.state ? location.state.description : "";
    const status = location.state ? location.state.status : "upcoming";
    const category = location.state ? location.state.category : "";
    const isFile = location.state ? location.state.file : false;
    //Variables for both cases updateing the post and creating the new post.
    const [file, setFile] = useState(null);
    const [postDescription, setPostDescription] = useState(description);
    const [postTopic, setPostTopic] = useState(topic);
    const [postCategory, setPostCategory] = useState(category);
    const [postStatus, setPostStatus] = useState(status);
    
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [alert, setAlert] = useState(false);
    const [alertContent, setAlertContent] = useState
        ({
            alertHeadline: "",
            alertMSG: ''
        })
    const queryClient = useQueryClient();
    //function to handle file while selecting the file for uploading with blog.
    const handlefile = (e) => {
        setFile(e.target.files[0]);
    }
    //function to upload the blog .
    const handleUpload = async () => {
        //input check while uploading the blog.
        const res = await uploadPost({ file, postTopic, postDescription, postCategory, postStatus });
        setAlert(true);
        setAlertContent({
            alertHeadline: res.status,
            alertMSG: res.msg
        })
        return res.status;
    }
    const handleEditPost = async () => {
        console.log(postStatus)
        const res = await editPost({ id, postTopic, postDescription, file, postCategory, postStatus });
        setAlert(true);
        setAlertContent({
            alertHeadline: res.status,
            alertMSG: res.msg
        })
        return res.status
    }
    const handleSubmit = async () => {
        let status;
        if (id) {
            status = await handleEditPost();
        }
        else {
            status = await handleUpload();
        }
        //invalidating the cache for fetching new updated data and then cache it.
        if (status == 'success') {
            queryClient.invalidateQueries([`posts`]);
            navigate('/user-posts')
        }
    }
    if (alert) return <Alert setAlert={setAlert} alertContent={alertContent} />
    return (
        <div className='create-post-section'>
            <Navbar color='#232536' />
            <div className='inputs'>
                <div className='topic cp-inputs'>
                    <label className='t-label'>Topic:</label>
                    <input type='text' className='topic-input' value={postTopic}
                        onChange={(e) => setPostTopic(e.target.value)}
                    />
                </div>
                <div className='cat cp-inputs'>
                    <label className='c-label' >Category:</label>
                    <div type='text' className='cat-input'
                        placeholder=' Blog Category'>
                        <span className=
                            {
                                `cat-item ${postCategory == 'business' ? 'selected-item' : ''}`
                            }
                            onClick={() => { setPostCategory('business') }}>Business</span>
                        <span className=
                            {`cat-item ${postCategory == 'technology' ? 'selected-item' : ''}`}
                            onClick={() => { setPostCategory('technology') }}>Technology</span>
                        <span className=
                            {`cat-item ${postCategory == 'lifestyle' ? 'selected-item' : ''}`}
                            onClick={() => { setPostCategory('lifestyle') }}>Lifestyle</span>
                        <span className=
                            {`cat-item ${postCategory == 'sports' ? 'selected-item' : ''}`}
                            onClick={() => { setPostCategory('sports') }}>Sports</span>
                    </div>
                </div>
                <div className="status cp-inputs">
                    <label className='s-label'>Status:</label>
                    <span
                        className={`status-item ${postStatus == 'public' ? 'selected-item' : ""}`}
                        onClick={() => setPostStatus('public')}> Public </span>
                    <span 
                        className={`status-item ${postStatus == 'upcoming' ? 'selected-item' : ""}`}
                        onClick={() => setPostStatus('upcoming')}> Upcoming </span>
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
                    <label className='f-label' style={file  ? {opacity: 0} : {}}>{"File: "}
                        {isFile ? "Previously Selected" : 'no file'}</label>
                    <input type='file' style={file ? {opacity:1}:{}} className='file-input' onChange={handlefile}  >
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
