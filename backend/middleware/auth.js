const jwt = require('jsonwebtoken');
const express = require('express');

const verifyToken = (req, res, next) => {
	try {
		const bearerHeader = req.headers['authorization'];
		// Check if bearer is undefined
		if (typeof bearerHeader !== 'undefined') {
			// Split at the space
			const bearer = bearerHeader.split(' ');
			// Get token from array
			const bearerToken = bearer[1];
			// Set the token
			req.token = bearerToken;
			// console.log(token);
			// Next middleware
			next();
		} else {
			// Forbidden
			res.status(403).send('Bearer Header not present');
		}
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
};

const createToken = (field) => {
	return jwt.sign(field, process.env.TOKEN_KEY);
};

// module.verifyToken = verifyToken;
// module.createToken = createToken;

module.exports = verifyToken;
