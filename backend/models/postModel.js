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
    file: {
      data: Buffer,
      contentType: String
    },
    comments:{
        type:[String],
        default:[]
    },
    likes:{
        type:Number,
        default:0
    }


})

const Post = mongoose.model("Post",postSchema)

export default Post;