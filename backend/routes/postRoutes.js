import express from 'express';

import { commentOnPost, getAllPosts, getPost, likeOnPost, uploadPost } from '../controllers/postControllers.js';
import { fetchUser } from '../middleware/fetchUser.js';
const router = express.Router();


//posts routes
//for all posts
router.get("/allPosts",getAllPosts);

//for a specific post.
router.get("/:id",getPost);

//for uploading a post.Need to be logged in and for that using fetchUser.
router.post("/upload",fetchUser,uploadPost);

//adding new comment on post
router.post("/commentOnPost",fetchUser,commentOnPost);

//add new like on post.
router.post("/likeOnPost",fetchUser,likeOnPost);



export default router;