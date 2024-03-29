import Group from "../models/GroupModel.js";

export const addGroup = async (req, res) => {
    try {
      const savedGroup = await Group.create(req.body);
      res.status(201).json({ savedGroup });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

export const showAll = async (req, res) => {
    try {
        const groups = await Group.find({});
		res.status(200).json({ groups });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}