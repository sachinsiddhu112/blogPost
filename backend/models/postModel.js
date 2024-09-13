import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    username:{
        type:String,  
    },
    topic:{
        type:String,
        default:"general"
    },
    description:{
        type:String,
        default:"New post"
    },
    category:{
        type:String,
        requried:true
    },
    featured:{
        type:String,
        default:"false"
    },
    file: {
      data: Buffer,
      contentType: String
    },
    comments:{
        type:[String],
        default:[]
    },
    likes:{
        type:[String],
        default:[]
    }


})

const Post = mongoose.model("Post",postSchema)

export default Post;