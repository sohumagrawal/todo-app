const express = require('express');
const mongoose = require('mongoose');
const Todo = require('../models/todoModel');
const User = require('../models/userModel');
const verifyToken = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const todoRouter = express.Router();
module.exports = todoRouter;

// GET ROUTES
// GET ALL OR SINGLE TODO OBJECT OR GET ALL TODOS FOR A SINGLE USER
todoRouter.get('/', async (req, res) => {
	const todos = await Todo.find({});

	try {
		res.send(todos);
	} catch (e) {
		res.status(500).send(e);
	}
});

// add specific auth
todoRouter.get('/:user/all', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.params.user);
		if (!user) {
			// does not give message that user does not exist
			res.status(404).json({
				success: false,
				message: 'User does not exist',
			});
		}

		if (req.token !== user.token || !(req.token && user.token)) {
			res.status(400).json({
				success: false,
				message: 'Unauthorized',
			});
		}

		jwt.verify(req.token, process.env.TOKEN_KEY, async (err, authData) => {
			const userId = user._id;

			const todos = await Todo.find({ userId });
			// sends back all todos for a specific user
			res.status(200).json(todos);
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: 'Something went wrong',
		});
	}
});

todoRouter.get('/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);
	// todo does not exist
	if (!todo) {
		// Todo object does not exist
		res.status(404).json({
			success: false,
			message: 'Todo does not exist',
		});
	}
	try {
		res.status(200).json({ success: true, todo });
	} catch (e) {
		res.status(500).json({
			success: false,
			message: 'Something went wrong',
		});
	}
});

// POST ROUTES
// CREATE NEW TODOS
// ADD AUTHENTICATION/AUTHORIZATION

todoRouter.post('/create', verifyToken, async (req, res, next) => {
	// auth functionality
	try {
		jwt.verify(req.token, process.env.TOKEN_KEY, async (err, authData) => {
			if (!authData)
				res.json({ success: false, message: 'Unauthorized' });
			if (err) {
				res.status(403).json({ success: false, error: err });
			}
			// find a user given a token
			// make sure that these still work after changing to findOne
			const user = await User.findOne({ token: req.token });
			const userId = user._id;

			const { name, description } = req.body;
			if (!name) {
				res.status(400).json({
					success: false,
					message: 'Must include a name',
				});
			}
			const todo = await Todo({
				name,
				description,
				userId,
			});

			await todo.save();
			res.send(todo);
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({ success: false, error: e });
	}
});

// PUT ROUTES
// CHANGE INDIVIDUAL TODO DETAILS
// ADD AUTH AND FUNCTIONALITY
todoRouter.patch('/:id', async (req, res) => {
	const id = req.params.id;
	const todo = await Todo.findById(id);

	console.log(todo); // for development
	const newValues = { $set: { name, description, completed } };
	todo.update();
});

todoRouter.patch(':id/complete', async (req, res) => {
	const todo = await Todo.findById(req.params.id);
	const completed = todo.completed ? false : true;
});
