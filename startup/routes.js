const express = require('express');
const auth = require('../routes/auth');
const expenses = require('../routes/expenses');
const currencies = require('../routes/currencies');
const categories = require('../routes/categories');
const error = require('../middleware/error');

module.exports = function (app) {
	app.use(express.json());
	app.use('/api/auth', auth);
	app.use('/api/currencies', currencies);
	app.use('/api/categories', categories);
	app.use('/api/expenses', expenses);
	//Always put the error handler middleware function at the end of every middlewares.
	app.use(error);
};
