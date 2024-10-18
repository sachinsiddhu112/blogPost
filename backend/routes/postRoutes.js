import express from 'express';

import { commentOnPost, getAllPosts, getPost, likeOnPost, uploadPost,updatePost, deletePost, getAllPostsOfOneAuthor } from '../controllers/postControllers.js';
import { fetchUser } from '../middleware/fetchUser.js';
const router = express.Router();


//posts routes
//for all posts
router.get("/allPosts",getAllPosts);

router.get("/authorAllPosts", fetchUser, getAllPostsOfOneAuthor)

//for a specific post.
router.get("/:id",getPost);

//for uploading a post.Need to be logged in and for that using fetchUser.
router.post("/upload",fetchUser,uploadPost);

//for updating the post.
router.put("/update/:id",fetchUser,updatePost);

//to delete post;
router.delete("/delete/:id",fetchUser,deletePost);
//adding new comment on post
router.post("/commentOnPost/:id",fetchUser,commentOnPost);

//add new like on post.
router.post("/likeOnPost/:id",fetchUser,likeOnPost);



export default router;