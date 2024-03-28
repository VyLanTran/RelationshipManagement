import GroupModel from "../models/GroupModel.js";
import UserModel from "../models/UserModel.js";

export const addGroup = async (req, res) => {
    try {
      const newGroup = new GroupModel(req.body);
  
      const savedGroup = await newGroup.save();
      res.status(201).json(savedGroup);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};