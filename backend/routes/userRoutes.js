const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { verifyToken } = require('../middleware/auth');

const userRouter = express.Router();
module.exports = userRouter;

// POST ROUTES
// FOR REGISTRATION AND LOGIN FUNCTIONALITY
userRouter.post('/register', async (req, res, next) => {
	const { name, email, password } = req.body;

	// check that user put present
	if (!(name && email && password)) {
		res.status(400).json({
			success: false,
			message: 'Not all input is present',
		});
	}

	// check if user already exists
	const oldUser = await User.findOne({ email });
	if (oldUser) {
		return res
			.status(409)
			.json({ success: false, message: 'User already exists' });
	}

	let encryptedPassword = await bcrypt.hash(password, 10);

	const token = jwt.sign({ email }, process.env.TOKEN_KEY); // refactor to using create token

	const user = new User({ name, email, password: encryptedPassword, token });

	try {
		await user.save();
		res.status(201).json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, error: true, message: error });
	}
});

userRouter.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!(email && password))
			res.status(400).json({
				success: false,
				message: 'Please input email and password',
			});
		const user = await User.findOne({ email });

		if (!user)
			res.status(404).json({
				success: false,
				message: 'User does not exist',
			}); // user doesn't exist

		// making bcrypt work
		bcrypt.compare(password, user.password, (err, response) => {
			if (err) {
				console.log(err);
				res.status(400).json({
					success: false,
					error: true,
					message: err,
				});
			}
			if (response) {
				// if user exists and password is good

				// JWT
				const token = jwt.sign({ email }, process.env.TOKEN_KEY); // convert to using createtoken function
				user.token = token;
				res.status(200).json({ user });
			} else {
				console.log(response);
				res.json({ success: false, message: 'Password is incorrect' });
			}
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({ success: false, error: true, message: e });
	}
});

// PATCH ROUTES
// CHANGE USER CREDENTIALS -- FINISH
userRouter.patch('/:id/edit', async (req, res, next) => {
	// find user
	const user = await User.findById(req.params.id);

	// check that user exists
	if (!user) {
		res.status(404).json({
			success: false,
			message: 'User does not exist',
		});
	}

	// change credentials
	const { name, email, password } = req.body;
	if (name) {
		// update name
	}
	if (email) {
		// update email
	}
	if (password) {
		// update password
		// dont forget to bcrypt thigns
	}
});

// GET ROUTES
// GET SINGLE AND ALL USERS
userRouter.get('/', async (req, res, next) => {
	const users = await User.find({});

	try {
		res.json({ success: true, users });
	} catch (e) {
		// console.log(e);
		res.status(500).send(e);
	}
});

userRouter.get('/:id', async (req, res, next) => {
	const user = await User.findById(req.params.id);
	try {
		res.send(user);
	} catch (e) {
		res.status(500).send(e);
	}
});

// DELETE ROUTES
// DELETES SINGLE AND MULTIPLE DOCUMENTS
userRouter.delete('/delete/:id', async (req, res, next) => {
	try {
		const user = await User.findByIdAndRemove(req.params.id);
		if (!user) {
			res.status(404).json({ success: false, message: 'User not found' });
		}
		res.status(202).json({
			success: true,
			message: 'User succesfully deleted',
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			success: false,
			message: 'User was not deleted',
		});
	}
});

userRouter.delete('/delete-multiple', async (req, res, next) => {
	try {
		const users = req.body.users;

		for (let i = 0; i < users.length; i++) {
			const user = await User.findByIdAndRemove(users[i]);
		}
		res.status(202).json({
			success: true,
			message: 'Users successfully deleted',
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			success: false,
			message: 'User was not deleted',
		});
	}
});
