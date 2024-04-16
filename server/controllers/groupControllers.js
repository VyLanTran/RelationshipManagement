import Group from "../models/GroupModel.js";
import User from "../models/UserModel.js"

export const addGroup = async (req, res) => {
    try {
        const savedGroup = await Group.create(req.body);
        res.status(201).json({savedGroup});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const showAll = async (req, res) => {
    try {
        const { user: userId } = req.params;
        const groups = await Group.find({ admin: userId });
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params;

        const group = await Group.deleteOne({ _id: groupId });
        res.status(201).json(group);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const showGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params;

        const group = await Group.findOne({ _id: groupId });
        res.status(201).json(group);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const editGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params;

        const group = await Group.findOneAndUpdate(
            { _id: groupId },
            req.body,
            {
                new: true,
            }
        );
	res.status(201).json(group);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const showMember = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const group = await Group.findOne({ _id: groupId });
        const members = await Promise.all(
            group.members.map((memberId) => User.findOne({_id: memberId}))
        );
        res.status(201).json(members);
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}