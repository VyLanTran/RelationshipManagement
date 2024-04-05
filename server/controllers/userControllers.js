import UserModel from "../models/UserModel.js";

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
