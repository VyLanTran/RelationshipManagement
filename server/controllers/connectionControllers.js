import ConnectionModel from "../models/ConnectionModel.js";
import Connection from "../models/ConnectionModel.js";
import UserModel from "../models/UserModel.js";

export const getAllConnections = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await UserModel.findById(userId);
		const connections = await Promise.all(
			user.connectionIds.map((connectionId) =>
				ConnectionModel.findById(connectionId)
			)
		);
		res.status(200).json({ connections });
	} catch (error) {
		res.status(500).json({ msg: error });
	}
};

export const createConnection = async (req, res) => {
	try {
		const connection = await Connection.create(req.body);
		res.status(201).json({ connection });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const getConnection = async (req, res) => {
	try {
		const { id: connectionId } = req.params;

		const connection = await Connection.findOne({ _id: connectionId });
		res.status(201).json({ connection });
	} catch (error) {
		res.status(500).json({ msg: error });
	}
};

export const deleteConnection = async (req, res) => {
	try {
		const { id: connectionId } = req.params;

		const connection = await Connection.deleteOne({ _id: connectionId });
		res.status(201).json({ connection });
	} catch (error) {
		res.status(500).json({ msg: error });
	}
};

export const updateConnection = async (req, res) => {
	try {
		const { id: connectionId } = req.params;
		const connection = await Connection.findOneAndUpdate(
			{ _id: connectionId },
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!connection) {
			res.status(404).json({ msg: `No connections with ID ${connectionId}` });
		}
		res.status(200).json({ connection });
	} catch (error) {
		res.status(500).json({ msg: error });
	}
};
