//const validateObjectId = require('../middleware/validateObjectId');
const { validateExpense, expenseModel } = require('../models/expenses');
// const authMiddleware = require('../middleware/auth');
// const adminMiddleware = require('../middleware/admin');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	const expenses = await expenseModel.getAll();
	res.send(expenses);
});

router.post('/', async (req, res) => {
	const { error } = validateExpense(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const expense = await expenseModel.store(req.body);
	return res.send(expense);
});

// router.get('/:id', validateObjectId, async (req, res) => {
// 	const expense = await expenseModel.getExpenseById(req.params.id);
// 	//const expense = expenses.find((g) => g.id === parseInt(req.params.id));
// 	if (!expense) return res.status(404).send('The expense with the given id was not found');
// 	return res.send(expense);
// });

// router.put('/:id', [ authMiddleware, adminMiddleware ], async (req, res) => {
// 	//const expense = expenses.find((g) => g.id === parseInt(req.params.id));
// 	const { error } = validateExpense(req.body);
// 	if (error) return res.status(400).send(error.details[0].message);

// 	const expense = await expenseModel.updateExpense(req.params.id, req.body);
// 	if (!expense) return res.status(404).send('The expense with the given id was not found');

// 	return res.send(expense);
// });

// router.delete('/:id', [ authMiddleware, adminMiddleware ], async (req, res) => {
// 	// const expense = expenses.find((g) => g.id === parseInt(req.params.id));
// 	const expense = await expenseModel.getExpenseById(req.params.id);
// 	if (!expense) return res.status(404).send('The expense with the given id was not found');

// 	// const index = expenses.indexOf(expense);
// 	// expenses.splice(index, 1);
// 	await expenseModel.deleteExpense(req.params.id);

// 	return res.send(expense);
// });

module.exports = router;
