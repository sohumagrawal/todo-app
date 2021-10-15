const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const { router } = require('./routes/index');
const connectDB = require('./config/db');
const bp = require('body-parser');

const userModel = require('./models/userModel');
const todoModel = require('./models/todoModel');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

mongoose
	.connect(process.env.MONGO_URI)
	.then(
		app.listen(
			PORT,
			console.log(
				`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
			)
		)
	);

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
	res.send('api is working');
});

app.use('/api', router);
