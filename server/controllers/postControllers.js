import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";

// POST
export const createPost = async (req, res) => {
  const {
    authorId,
    pictures,
    description,
    memberIds,
    location,
    likes,
    comments,
  } = req.body;
};
