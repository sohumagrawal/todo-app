const mongoose = require('mongoose');

const todoScheme = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		userId: {
			type: String,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);
const Todo = mongoose.model('Todo', todoScheme);
module.exports = Todo;
