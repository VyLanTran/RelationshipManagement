import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
});
const ConnectionModel = mongoose.model("Connection", ConnectionSchema);
export default ConnectionModel;
