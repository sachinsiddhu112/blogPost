import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./CreatePost.css"
export default function CreatePost() {
    //variables.
    const [file, setFile] = useState(null);
    const [postDescription, setPostDescription] = useState("");
    const [postTopic, setPostTopic] = useState("");
    const navigate = useNavigate();

    //function to handle file while selecting the file for uploading with blog.
    const handlefile = (e) => {
        setFile(e.target.files[0]);
    }
    //function to upload the blog .
    const handleUpload = async () => {
        //input check while uploading the blog.
        if (!file || !postTopic || !postDescription) {
            alert("Fill in detials before posting your blog.")
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', postDescription);
        formData.append("topic", postTopic);

        try {
            const response = await axios.post('/post/upload', formData, {
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

    return (
        <div className='create-post-section'>
            <div className='inputs'>
                <div className='topic inputItem'>
                    <label className='t-label'>Topic</label>
                    <input type='text' className='topic-input'
                        onChange={(e) => setPostTopic(e.target.value)}
                        placeholder=' Blog topic' />
                </div>
                <div className='description inputItem'>
                    <label className='d-label' >Description</label>
                    <textarea type='text' className='description-input' onChange={(e) => setPostDescription(e.target.value)} placeholder='Blog content'></textarea>
                </div>
                <div className='file inputItem'>
                    <label className='f-label'>File</label>
                    <input type='file' className='file-input' onChange={handlefile} placeholder='no file' >
                    </input>
                </div>
                <button onClick={handleUpload} className='upload-btn'>Post</button>
                <button onClick={() => navigate("/")} className='upload-btn'>Cancel</button>
            </div>
        </div>

    )
}
