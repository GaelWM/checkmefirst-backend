const express = require('express');
//const bodyParser = require('body-parser');
const auth = require('../routes/auth');
const users = require('../routes/users');
const expenses = require('../routes/expenses');
const expenseItems = require('../routes/expense-items');
const currencies = require('../routes/currencies');
const categories = require('../routes/categories');
const error = require('../middleware/error');

module.exports = function (app) {
	app.use(express.json());
	//app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
	app.use('/api/auth', auth);
	app.use('/api/users', users);
	app.use('/api/currencies', currencies);
	app.use('/api/categories', categories);
	app.use('/api/expenses', expenses);
	app.use('/api/expense-items', expenseItems);
	//Always put the error handler middleware function at the end of every middlewares.
	app.use(error);
};
