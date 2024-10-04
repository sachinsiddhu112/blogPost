import axios from "axios";

const baseUrl = `${process.env.REACT_APP_HOST}/post/allPosts`
export const fetchAllPost = async (passUrl) => {
    //fetching all posts.
    const response = await axios.get(`${baseUrl}${passUrl}`);
    return response.data;
};