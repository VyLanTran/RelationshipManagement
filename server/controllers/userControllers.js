import UserModel from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";

// GET
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    const friends = await Promise.all(
      user.friends.map((friendId) => UserModel.findById(friendId))
    );
    res.status(200).json(friends);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// PATCH
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profilePicture } = req.body;
    const uploadRes = await cloudinary.uploader.upload(profilePicture, {
      upload_preset: "group4-preset",
    });
    if (uploadRes) {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: { profilePicture: uploadRes } },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(404).json({ mesage: err.message });
  }
};

export const createCoverPhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    const { coverPhoto } = req.body;
    const uploadRes = await cloudinary.uploader.upload(coverPhoto, {
      upload_preset: "group4-preset",
    });
    if (uploadRes) {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: { coverPhoto: uploadRes } },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(404).json({ mesage: err.message });
  }
};
