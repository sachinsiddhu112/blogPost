import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import "./Posts.css"
import { authContext } from '../../context/authContext';
export default function Posts() {

    const navigate = useNavigate();
    const {user} = useContext(authContext)
    const [data, setData] = useState([]);
    const [randomColors,setRandomColors] = useState([]);

    useEffect(() => {

        const fetchAllfiles = async () => {
            try {
                const response = await axios.get('http://localhost:3001/post/allPosts');

                setData(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        const fetchColors = async () => {
            const colors = await axios.get(`https://x-colors.yurace.pro/api/random?number=${data.length!=0 ? data.length : 100}&type=light`);
            console.log(colors);
            setRandomColors(colors.data);
        }

        fetchAllfiles();
        fetchColors();
    }, [])



    //checking the file type in a particular post to show it on web page.
    const renderFile = (file) => {

        const base64Data = `data:${file.contentType};base64,${file.base64}`;
        if (file.contentType.startsWith('image/')) {
            //file type file
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

    return (
        <div className='post-container'>
            <div className='all-posts'>

                {data.map((post,ind) => (
                    <div key={post._id} className='all-posts-post'>


                        <div className='all-posts-post-details' onClick={() => navigate(`/post/${post._id}`)}>
                            <div className='user-details'>
                                <img className="user-pic" src={`https://avatar.iran.liara.run/username?username=${user + user}`} alt='owner' />
                                <span className='user-name'>{post.user}</span>

                            </div>
                            <span className='tag'>{post.topic}</span>

                            {renderFile(post)}
                        </div>
                        <div className={`background ${ind %2 ==0 ? "shift-left":"shift-right"}`} style={{backgroundColor:randomColors[ind % randomColors.length].rgb  }}>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}
