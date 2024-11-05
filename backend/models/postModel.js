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
        data: {
            type: Buffer,
            default: null,
          },
          contentType: {
            type: String,
            default: null,
          },
    },
    comments:{
        type:[String],
        default:[]
    },
    likes:{
        type:[String],
        default:[]
    },
    status:{
        type: String,
        default: 'upcoming'
    },
    date:{
        type:Date,
        default:Date.now
    }


})

const Post = mongoose.model("Post",postSchema)

export default Post;