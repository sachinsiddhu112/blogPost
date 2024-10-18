import axios from "axios";

const baseUrl = `${process.env.REACT_APP_HOST}/post`
export const fetchAllPost = async (passUrl) => {
    //fetching all posts.
    const response = await axios.get(`${baseUrl}${passUrl}`);
    return response.data;
};
//function to delete the post.
export const deletePost = async ({id}) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`, {
        headers: 
        {
          'authToken': JSON.parse(sessionStorage.getItem('authToken'))
        }})
      return {status:'success', msg:'Post deleted successfully.'};
    }
    catch (error) {
      console.log(error);
      return {status:'failed',msg:error.response.data.error}
    }
  }
 //upload new post.
  export const uploadPost = async ({file, postTopic, postDescription, postCategory}) => {
    //input check while uploading the blog.
    if (!file || !postTopic || !postDescription || !postCategory) {
        return {status:'failed',msg:"Provide complete post information."}
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', postDescription);
    formData.append("topic", postTopic);
    formData.append('category', postCategory)

    try {
        const response = await axios.post(`${baseUrl}/upload`, formData, {
            headers:
             {
                'Content-Type': 'multipart/form-data',
                'authToken': JSON.parse(sessionStorage.getItem("authToken"))
            },
        });
       return {status:'success',msg:"Post uploaded successfully."};
    }
    catch (err) {
        console.log(err);
        return {status:'failed', msg:err.response.data.error};
    }
}

  // Updating the blog.

  export const editPost = async ({id,postTopic,postDescription,file,postCategory}) => {
    //if no input no need to send request for updation to backend.
    if (!postTopic && !postDescription && !file && !postCategory) {
      
      return {status:'failed',msg:'Please provide some details to update.'}
    }
    try {
      const formData = new FormData();
      if (postTopic) formData.append('topic', postTopic);
      if (postDescription) formData.append('description', postDescription);
      if (file) formData.append('file', file);
      if(postCategory) formData.append('category',postCategory)
      const res = await axios.put(`${baseUrl}/update/${id}`, formData, {
        headers: 
        {
          'Content-Type': 'multipart/form-data',
          'authToken': JSON.parse(sessionStorage.getItem('authToken'))
        }})
     return {status:'success', msg:'Post updated successfully.'};
    }
    catch (error) {
      console.log(error);
      return {status:'failed',msg:error.response.data.error};
    }
  }