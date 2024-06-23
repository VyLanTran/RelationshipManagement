import mongoose from "mongoose";


const PostSchema = new mongoose.Schema(
  {
  memberIds: [{
    type: String,
    required: true,
  }],
  pictures: [{
          type: Object,
          default: null,
      }],
  description: String,
  location: String,
},
{ timestamps: true }
);


const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;