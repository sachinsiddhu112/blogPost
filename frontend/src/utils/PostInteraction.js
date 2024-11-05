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


