


import {Buffer} from "buffer"
import Post from "../models/postModel.js";
import User from "../models/authModel.js";




//endpoint for providing all posts
export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find({}, 'username file.data file.contentType description topic');
      const list = posts.map(post => ({
        _id: post._id,
        user: post.username ||'SachinSiddhu',
        topic:post.topic || "general",
        description:post.description,
        contentType: post.file.contentType,
        base64: Buffer.from(post.file.data).toString('base64'),
      }
    )
    );
     
      res.status(200).json(list); // Correct usage to send JSON response with a 200 status
    } catch (error) {
        console.log(error)
      res.status(500).send('Error retrieving posts'); // Correct usage to send error message with a 500 status
    }
    
}


//endpoint to serve single post to user with the help of post id.

export const getPost = async (req,res) => {
 
  try{
    const post = await Post.findById(req.params.id);
   
    if(!post){
      
      res.json("Sorry,we don't have this post");
      return;
    }
    const selectedPost = {
      _id: post._id,
      user: post.username ||'SachinSiddhu',
      topic:post.topic|| "general",
      description:post.description,
      contentType: post.file.contentType,
      base64: Buffer.from(post.file.data).toString('base64'),
    }
    
    res.status(200).json(selectedPost);
  }
  catch(error){
    console.log("error in serving this post",error);
    res.status(500).send("Error in fetching this post");
  }

}

//endpoint for uploading new post.
export const uploadPost = async (req,res) =>{

    try {
      
      //checking the user exist authenticated in fetchUser function.
      const user = await User.findById(req.user.id);
      if(!user){
        res.status(401).json({error:"Please signup first"});

        return;
      }
      //creating new post in databse
        const newPost = new Post({
          username:user.username,
          topic:req.body.topic,
          description:req.body.description,
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
        res.status(500).send('Error uploading post');
      }
}

//endpoint to add new comment on post.
export const commentOnPost = async (req,res) =>{

  const user = await User.findById(req.user.id);
  const newComment = req.body.comment;
  if(!user){
    res.status(401).json({error:"Please signup first"});
    return;
  }
  try{
  const post = await Post.findById(req.params.id);

  post.comments.push(newComment);

  // Save the updated post
  await post.save();
  res.status(200).json({ message: "You commented on this post  successfully"});
}
catch(error){
  console.log("error on adding comment",error);
  res.status(500).json({error:"Server side error"});
}
}

//endpoint to add new like on the post.
export const likeOnPost = async (req,res) => {
  const user = await User.findById(req.user.id);

  if(!user){
    res.status(401).json({error:"Please signup first"});
    return;
  }

  try{

    const post =  await Post.findById(req.params.id);
    post.likes=post.likes + 1;
    await post.save();

    res.status(200).json({message:"You liked on this post successfully"})
  }
  catch(error){
    console.log("error on adding new like",error);
    res.status(500).json({error:"Server side error"});
  }

}