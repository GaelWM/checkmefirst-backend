const validateObjectId = require('../middleware/validateObjectId');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { validateExpense, expenseModel } = require('../models/expenses');
const express = require('express');
const router = express.Router();

// GET ROUTES
router.get('/', authMiddleware, async (req, res) => {
	const expenses = await expenseModel.getExpenses();
	res.send(expenses);
});

router.get('/:id', [authMiddleware, validateObjectId], async (req, res) => {
	const expense = await expenseModel.getExpenseById(req.params.id);
	if (!expense) return res.status(404).send('The expense with the given id was not found');
	return res.send(expense);
});

router.get('/user/:id', [authMiddleware, validateObjectId], async (req, res) => {
	const userExpenses = await expenseModel.getUserExpenses(req.params.id);
	if (!userExpenses) return res.status(404).send('The user with the given id does not have any registered expenses.');
	return res.send(userExpenses);
});


// POST ROUTES
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
	const { error } = validateExpense(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	if (!req.user._id) return res.status(404).send('You are not logged In. Please login to proceed.');

	const expense = await expenseModel.createExpense(req.body, req.user._id);
	return res.send(expense);
});


// UPDATES & DELETE ROUTES
router.put('/:id', [authMiddleware, adminMiddleware, validateObjectId], async (req, res) => {
	const { error } = validateExpense(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const expense = await expenseModel.updateExpense(req.params.id, req.user._id, req.body);
	if (!expense) return res.status(404).send('The expense with the given id was not found');

	return res.send(expense);
});

router.delete('/:id', [authMiddleware, adminMiddleware, validateObjectId], async (req, res) => {
	const expense = await expenseModel.getExpenseById(req.params.id);
	if (!expense) return res.status(404).send('The expense with the given id was not found');

	await expenseModel.deleteExpense(req.params.id);

	return res.send(expense);
});

module.exports = router;
