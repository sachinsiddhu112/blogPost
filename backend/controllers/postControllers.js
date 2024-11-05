
import { Buffer } from "buffer"
import Post from "../models/postModel.js";
import User from "../models/authModel.js";
import client from "../caching/redis.js";
import Subscribers from "../models/subscriberModel.js"
import { sendMail } from "../notifications/nodemailer.js";
//endpoint for providing all posts

export const getAllPosts = async (req, res) => {
  try {
    const { featured, limit, category, status = 'public' } = req.query;
    const limitValue = parseInt(limit, 10) || 0;
    const query = { limitValue, featured, category };
    if (featured == 'true') {
      //for providing featured post.
      //hit cache.
      const cachePost = await client.get(`featured`);
      if (cachePost) {
        const post = await JSON.parse(cachePost);
        return res.status(200).json(post);
      }
      //mis cache
      const post = await Post.findOne({ featured: true });
      if (!post) {
        return res.status(200).json({ message: "No Post." });
      }
      const featuredPost = {
        //creating a list of posts suitable to render info on webpage on frontend.
        _id: post._id,
        user: post.username,
        topic: post.topic || "general",
        description: post.description,
        comments: post.comments,
        likes: post.likes,
        status: 'public',
        date: post.date || new Date(),
        category: post.category,
        featured: post.featured || true,
        contentType: post.file.contentType,
        base64: Buffer.from(post.file.data).toString('base64'),
      }
      //in case of mis cache,store featured post in cache.
      client.set(`featured`, JSON.stringify(featuredPost));
      return res.status(200).json(featuredPost);
    }
    else {
      //no categroy means ,request for all posts.
      //all posts from cache.
      const cachedPosts = await client.get(`posts:${status}`);
      if (cachedPosts != null) {//for cache hit.
        const parsePosts = await JSON.parse(cachedPosts);
        //for limited posts.
        let result = [];
        result = await parsePosts.filter((post) => {
          return (category ? post.category == category : true) &&
            (featured ? post.featured == featured : true) &&
            (req.query.id ? req.query.id != post._id : true)
        })
        const data = limitValue != 0 && limitValue < result.length ? result.slice(0, limitValue) : result;
        console.log(data.length);
        return res.status(200).json(data);
      }
      //if posts are not cached.
      const posts = await Post.find({ status });
      const list = posts.map(post => ({
        //creating a list of posts suitable to render info on webpage on frontend.
        _id: post._id,
        user: post.username,
        topic: post.topic || "general",
        description: post.description,
        comments: post.comments,
        likes: post.likes,
        date: post.date || new Date(),
        category: post.category,
        featured: post.featured || false,
        contentType: post.file.contentType != null ? post.file.contentType : null,
        base64: post.file.data != null ? Buffer.from(post.file.data).toString('base64') : null,
      }));
      //in case of mis cache,store all posts in cache.
      client.set(`posts:${status}`, JSON.stringify(list));
      const result = limitValue != 0 ? list.slice(0, limitValue) : list;
      console.log(result.length)
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Server side error." })
  }
}
//get all posts of an author.
export const getAllPostsOfOneAuthor = async (req, res) => {
  const user = await User.findById(req.user.id);
  const status = req.query ? req.query.status : 'public';
  if (!user) {
    return res.status(401).json({ messaage: "Unauthorized access." })
  }
  try {
    const cachedPosts = await client.get(`posts:${user.username}:${status}`);
    if (cachedPosts != null) {
      const parse = await JSON.parse(cachedPosts);
      console.log(status,parse.length)
      return res.status(200).json(parse);
    }
    const querry = { username: user.username, status: status };
    const posts = await Post.find(querry)
    const list = posts.map(post => ({
      //creating a list of posts suitable to render info on webpage on frontend.
      _id: post._id,
      user: post.username,
      topic: post.topic || "general",
      description: post.description,
      comments: post.comments,
      likes: post.likes,
      category: post.category,
      status: post.status || 'public',
      date: post.date || new Date(),
      featured: post.featured || false,
      contentType: post.file.contentType != null ? post.file.contentType : null,
      base64: post.file.data != null ? Buffer.from(post.file.data).toString('base64') : null,
    }));
    client.set(`posts:${user.username}:${status}`, JSON.stringify(list));
    res.status(200).json(list);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "server side error." })
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
      featured: post.featured,
      category: post.category,
      date: post.date || new Date(),
      likes: post.likes,
      contentType: post.file.contentType,
      base64: Buffer.from(post.file.data).toString('base64'),
    }
    res.status(200).json(selectedPost);
  }
  catch (error) {
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
      category: req.body.category || 'business',
      status: req.body.status || 'upcoming',
      date: new Date(),
      file: {
        data: req.file?.buffer || null,
        contentType: req.file?.mimetype || null
      }
    });
    //sending notification to all subscribers about this post;
    if(newPost.status == 'public')
      {
    const subArray = await Subscribers.findOne();
    const msg = `<h2> We have new blog by ${user.username}.</h2>
    <p1><strong>Headline</strong>:${req.body.topic}.`
    subArray.subscribers.map((subscriber) => {
      sendMail(subscriber, "BlogPost Team", msg);
    })}
    //saving new post in database and clear cache.
    client.del(`posts:${req.body.status}`);
    client.del(`posts:${user.username}:${req.body.status}`);
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
    post.status = req.body?.status || post.status;
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
    client.del('featured');
    client.del(`posts:public`);
    client.del('posts:upcoming');
    client.del(`posts:${user.username}:public`);
    client.del(`posts:${user.username}:upcoming`);
    return res.status(200).json(newPost);
  }
  catch (error) {
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
      return res.status(401).json({ error: "Blog don't exist" });
    }
    //checking the user is the owner of the blog post or not by using the username .
    if (post.username != user.username) {
      res.status(401).json({ error: "You are not authorized to perform this operation." })
      return;
    }
    const status = post.status;
    await post.deleteOne();
    client.del(`posts:${status}`);
    client.del(`posts:${user.username}:${status}`);
    res.status(200).json("Successfully deleted the post.")
  }
  catch (error) {
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
    res.status(500).json({ error: "Server side error" });
  }

}