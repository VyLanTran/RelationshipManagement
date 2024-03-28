import Connection from "../models/ConnectionModel.js";

export const getAllConnections = async (req, res) => {
	try {
		const connections = await Connection.find({});
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
		res.status(500).json({ msg: error });
	}
};
