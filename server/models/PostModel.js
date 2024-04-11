import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    pictures: {
      // TODO: multiple pictures
      // type: Array,
      // default: [],
      type: Object,
      default: null,
    },
    description: String,
    memberIds: {
      type: Array,
      default: [],
    },
    location: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;
