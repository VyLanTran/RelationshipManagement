import UserModel from "../models/UserModel.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = UserModel.findById(userId);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
