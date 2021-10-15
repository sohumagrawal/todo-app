const express = require('express');
const userRouter = require('./userRoutes');
const todoRouter = require('./todoRoutes');

const router = express.Router();
exports.router = router;

router.get('/', (req, res, next) => {
	res.json({ msg: 'api is working through router' });
});

router.use('/todos', todoRouter);
router.use('/users', userRouter);
