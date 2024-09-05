  import axios from "axios";
  
  //function for adding the like on blog.
export const likePost = async ({id}) => {
  try {
    const response = await axios.post(`https://blog-post-backend.vercel.app/post/likeOnPost/${id}`, {}, {
      headers: {
        'authToken': JSON.parse(sessionStorage.getItem('authToken'))
      }
    })
    return response.data;
  }
  catch (error) {
    console.log("Error in like", error)
    alert(error.response.data.error);
  }
}


export const commentPost = async ({comment,id}) => {
    
    const formData = new FormData();
    formData.append('comment', comment);
    try {
      const response = await axios.post(`https://blog-post-backend.vercel.app/post/commentOnPost/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authToken': JSON.parse(sessionStorage.getItem('authToken'))
        }
      })
      
      return response.data;
    }
    catch (error) {
      console.log("Error in like", error)
      alert(error.response.data.error);
    }
  }

//function to delete the post.
 export const deletePost = async ({id}) => {
    try {
      const res = await axios.delete(`https://blog-post-backend.vercel.app/post/delete/${id}`, {
        headers: {
          'authToken': JSON.parse(sessionStorage.getItem('authToken'))
        }
      })
      alert("Delete operation successfull.")
    }
    catch (error) {
      console.log(error);
      alert(error.response.data.error)
    }
  }

  // Updating the blog.

  export const editPost = async ({postTopic,postDescription,file,id}) => {
    //if no input no need to send request for updation to backend.
    if (!postTopic && !postDescription && !file) {
      alert("You should give some input to update post");
      return;
    }
    try {
    
      const formData = new FormData();
      if (postTopic) formData.append('topic', postTopic);
      if (postDescription) formData.append('description', postDescription);
      if (file) formData.append('file', file);
      const res = await axios.put(`https://blog-post-backend.vercel.app/post/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authToken': JSON.parse(sessionStorage.getItem('authToken'))
        }
      })
      if (res.status != 200) {
        alert("Update operation failed");
      }
      
      return res.data
    }
    catch (error) {
      console.log(error);
      alert(error.response.data.error)
    }
  }