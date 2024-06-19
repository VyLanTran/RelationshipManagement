import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";

export const getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.find({})
    res.status(200).json({posts})
  } catch (error) {
    res.status(500).json({msg: error})
  }
}

export const getPost = async (req, res) => {
  try {
    const {id: postId} = req.params
    const post = await PostModel.findOne({_id: postId})
    res.status(200).json({post})
  } catch (error) {
    res.status(500).json({msg: error})
  }
  
}

// POST
export const createPost = async (req, res) => {
  try {
    const post = await PostModel.create(req.body)
    res.status(201).json({post})
  } catch (error) {
    res.status(500).json({msg: error})
  }
};

export const updatePost = async (req, res) => {
  try {
    const {id: postId} = req.params
    const userId = req.user._id

    const post = await PostModel.findById(postId)
    if(!post) {
      res.status(404).json({msg: `No post with id ${postId}`})
    }

    if(!post.memberIds.includes(userId.toString())) {
      return res.status(403).json({ msg: 'You are not authorized to update this post' })
    }

    const allowedUpdates = ['description', 'location'];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).json({ msg: 'Invalid updates!' });
    }
    
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({post: updatedPost})
  } catch (error) {
    res.status(500).json({msg: error})
  }
}

export const deletePost = async (req,res) => {
  try {
    const {id: postId} = req.params
    const post = await PostModel.findOneAndDelete({_id: postId})
    if(!post) {
      res.status(404).json({msg: `No post with id ${postId}`})
    }
    res.status(201).json({post})
  } catch (error) {
    res.status(500).json({msg: error})
  }
}