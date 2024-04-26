import mongoose from 'mongoose'

const ConnectionSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
	},
	relationship: {
		type: String,
	},
	hobbies: {
		type: [],
		default: null,
	},
	meet_how: {
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
	school: {
		type: String,
	},
	location: {
		type: String,
	},
	avatar: {
		type: String,
	},
	fun_facts: {
		type: Array,
		default: [],
	},
	others: {
		type: Array,
		default: [],
	},
})
const ConnectionModel = mongoose.model('Connection', ConnectionSchema)
export default ConnectionModel
