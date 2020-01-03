//const auth = require('../routes/auth');
const expenses = require('../routes/expenses');
const error = require('../middleware/error');
const express = require('express');

module.exports = function(app) {
	app.use(express.json());
	//app.use('/api/auth', auth);
	app.use('/api/expenses', expenses);
	//Always put the error handler middleware function at the end of every middlewares.
	app.use(error);
};
