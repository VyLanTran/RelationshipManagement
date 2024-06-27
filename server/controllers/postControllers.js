import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";

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
    const userId = req.user._id
    const post = await PostModel.findOneAndDelete({_id: postId})
    if(!post) {
      res.status(404).json({msg: `No post with id ${postId}`})
    }
    if(!post.memberIds.includes(userId.toString())) {
      return res.status(403).json({ msg: 'You are not authorized to delete this post' })
    }
    res.status(201).json({post})
  } catch (error) {
    res.status(500).json({msg: error})
  }
}

export const addPictures = async (req, res) => {
  try {
    const postId = req.post._id
    const { pictures } = req.body
    const uploadRes = await cloudinary.uploader.upload(pictures, {
      upload_preset: 'group4-preset',
    })
    if(uploadRes) {
      const updatedPost = await PostModel.findOneAndUpdate(
        {_id: postId},
        {$set: {pictures: uploadRes}},
        {
          new: true,
          runValidators: true,
        }
      )
      res.status(200).json(updatedPost)
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

export const deletePicture = async (req, res) => {
  try {
    const postId = req.post._id
    const {pictureId} = req.body

    const deleteRes = await cloudinary.uploader.destroy(pictureId)
    if (deleteRes) {
      const deletedPost = await PostModel.findOneAndUpdate(
        {_id: postId},
        {$pull: {pictures: deleteRes}},
        {
          new: true,
        }
      )
      res.status(200).json(deletedPost)
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

export const addMembers = async (req, res) => {
  try {
    const postId = req.post._id
    const userId = req.user._id

    const post = await PostModel.findById(postId)
    if(!post) return res.status(404)
    
    if(!post.memberIds.includes(userId)) {
      return res.status(403).json({msg: 'You are not allowed to edit this post!'})
    }

    const newPost = await PostModel.findOneAndUpdate(
      postId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    return res.status(200).json({post: newPost})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}