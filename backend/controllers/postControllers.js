
import { Buffer } from "buffer"
import Post from "../models/postModel.js";
import User from "../models/authModel.js";

//endpoint for providing all posts
export const getAllPosts = async (req, res) => {
  try {
    const {featured,limit,category} = req.query;
    const limitValue = parseInt(limit, 10);

    if(featured == 'true'){
      const post = await Post.findOne({ featured: true });
      const featuredPost = {
         //creating a list of posts suitable to render info on webpage on frontend.
         _id: post._id,
         user: post.username,
         topic: post.topic || "general",
         description: post.description,
         comments: post.comments,
         likes: post.likes,
         category:post.category,
         featured:post.featured || false,
         contentType: post.file.contentType,
         base64: Buffer.from(post.file.data).toString('base64'),
      }
      res.status(200).json(featuredPost);
      return;
    }
    else {
      const querry = category? {category}:{};
      querry._id =  { $ne: req.query.id };
      const posts = await Post.find(querry, 'username file.data file.contentType description topic likes comments category').limit(limitValue ? limitValue : 0);
      const list = posts.map(post => ({
        //creating a list of posts suitable to render info on webpage on frontend.
        _id: post._id,
        user: post.username,
        topic: post.topic || "general",
        description: post.description,
        comments: post.comments,
        likes: post.likes,
        category:post.category,
        featured:post.featured || false,
        contentType: post.file.contentType,
        base64: Buffer.from(post.file.data).toString('base64'),
      }));
      res.status(200).json(list);
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server side error." })
  }
}


//endpoint to serve single post to user with the help of post id.
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {//if no post exist with provided id.
      res.status(403).json({ error: "Sorry,we don't have this post" });
      return;
    }
    //if exist then .
    const selectedPost = {
      _id: post._id,
      user: post.username,
      topic: post.topic || "general",
      description: post.description,
      comments: post.comments,
      featured:post.featured,
      category:post.category,
      likes: post.likes,
      contentType: post.file.contentType,
      base64: Buffer.from(post.file.data).toString('base64'),
    }

    res.status(200).json(selectedPost);
  }
  catch (error) {
    console.log("error in serving this post", error);
    res.status(500).json({ error: "Server side error." });
  }

}

//endpoint for uploading new post.
export const uploadPost = async (req, res) => {
  try {
    //checking the user exist or not ,who is authenticated in fetchUser function.
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(401).json({ error: "Please signup first" });
      return;
    }
    //creating new post in databse
    const newPost = new Post({
      username: user.username,
      topic: req.body.topic,
      description: req.body.description,
      category:req.body.category,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    //saving new post in database
    const savedPost = await newPost.save();
    res.status(200).json(savedPost); // sending new post uploaded by user
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server side error" })
  }
}

//for updating the blog post
export const updatePost = async (req, res) => {
  //checking the user exist or not ,who is authenticated in fetchUser function.
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401).json({ error: "Please signup first." })
    return;
  }
  const post = await Post.findById(req.params.id);//checking post exist or not.
  if (!post) {
    res.status(403).json({ error: "Blog don't exist" });
    return;
  }
  //checking the user is the owner of the blog post or not by using the username inpost.
  if (post.username != user.username) {
    res.status(401).json({ error: "You are not authorized to update this post." });
    return;
  }
  try {
    post.topic = req.body?.topic || post.topic;
    post.description = req.body?.description || post.description;
    post.file.data = req.file?.buffer || post.file.data;
    post.file.contentType = req.file?.mimetype || post.file.contentType;
    const savedPost = await post.save();
    const newPost = {
      _id: savedPost._id,
      user: savedPost.username || 'SachinSiddhu',
      topic: savedPost.topic || "general",
      description: savedPost.description,
      comments: savedPost.comments,
      likes: savedPost.likes,
      contentType: savedPost.file.contentType,
      base64: Buffer.from(savedPost.file.data).toString('base64'),
    }
    res.status(200).json(newPost);
    return;

  }
  catch (error) {
    console.log("error in updating post", error);
    res.status(500).json({ error: "Server side error" });
    return;
  }

}

//function to delete the post.
export const deletePost = async (req, res) => {
  //checking the user exist or not ,who is authenticated in fetchUser function.
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401).json({ error: "Please signup first." })
    return;
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(401).json({ error: "Blog don't exist" });
      return;
    }
    //checking the user is the owner of the blog post or not by using the username .
    if (post.username != user.username) {
      res.status(401).json({ error: "You are not authorized to perform this operation." })
      return;
    }
    await post.deleteOne();
    res.status(200).json("Successfully deleted the post.")
  }
  catch (error) {
    console.log("error in delete function", error);
    res.status(500).json({ error: "Server side error" });
  }
}

//endpoint to add new comment on post.
export const commentOnPost = async (req, res) => {
  const user = await User.findById(req.user.id);
  const newComment = req.body.comment;
  //checking the user exist or not ,who is authenticated in fetchUser function.
  if (!user) {
    res.status(401).json({ error: "Please signup first" });
    return;
  }
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push(newComment);
    // Save the updated post
    const savedPost = await post.save();
    const newPost = {
      _id: savedPost._id,
      user: savedPost.username,
      topic: savedPost.topic,
      description: savedPost.description,
      comments: savedPost.comments,
      likes: savedPost.likes,
      contentType: savedPost.file.contentType,
      base64: Buffer.from(savedPost.file.data).toString('base64'),
    }
    res.status(200).json(newPost);
  }
  catch (error) {
    console.log("error on adding comment", error);
    res.status(500).json({ error: "Server side error" });
  }
}

//endpoint to add new like on the post.
export const likeOnPost = async (req, res) => {
  const user = await User.findById(req.user.id);
  //checking the user exist or not ,who is authenticated in fetchUser function.
  if (!user) {
    res.status(401).json({ error: "Please signup first" });
    return;
  }
  try {
    const post = await Post.findById(req.params.id);
    //removing the user who liked this post,if he double tap the like button.
    if (post.likes.includes(user.username)) {
      post.likes = post.likes.filter(like => like != user.username);
    }
    else {
      post.likes.push(user.username);
    }
    const savedPost = await post.save();
    const newPost = {
      _id: savedPost._id,
      user: savedPost.username,
      topic: savedPost.topic,
      description: savedPost.description,
      comments: savedPost.comments,
      likes: savedPost.likes,
      contentType: savedPost.file.contentType,
      base64: Buffer.from(savedPost.file.data).toString('base64'),
    }
    res.status(200).json(newPost);
  }
  catch (error) {
    console.log("error on adding new like", error);
    res.status(500).json({ error: "Server side error" });
  }

}