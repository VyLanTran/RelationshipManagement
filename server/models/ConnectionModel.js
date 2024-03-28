import mongoose from "mongoose";
import User from "./UserModel";

const ConnectionSchema = new mongoose.Schema({
	author: {
		type: User,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
	},
	email: {
		type: String,
	},
	username: {
		type: String,
	},
	birthday: {
		type: Date,
	},
	avatar: {
		type: Image,
	},
	fun_facts: {
		type: Array,
		default: [],
	},
	others: {
		type: Array,
		default: [],
	},
});
const ConnectionModel = mongoose.model("Connection", ConnectionSchema);
export default ConnectionModel;
