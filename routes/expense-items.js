const validateObjectId = require('../middleware/validateObjectId');
const validateExpenseId = require('../middleware/validateExpenseId');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const express = require('express');
const { validateExpenseItem, expenseItemModel } = require('../models/expense-items');
const { expenseModel } = require('../models/expenses');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const expenseItems = await expenseItemModel.getExpenseItems();
    res.send(expenseItems);
});

router.post('/:expenseId', [authMiddleware, validateExpenseId], async (req, res) => {
    const expense = expenseModel.getExpenseById(req.params.expenseId);
    if (expense === null) return res.status(404).send('The expense with the given id was not found');

    const { error } = validateExpenseItem(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const expenseItem = await expenseItemModel.createExpenseItem(req.params.expenseId, req.body);
    return res.send(expenseItem);
});

router.get('/:id', [authMiddleware, validateObjectId], async (req, res) => {
    const expenseItem = await expenseItemModel.getExpenseItemById(req.params.id);
    if (!expenseItem) return res.status(404).send('The expenseItem with the given id was not found');
    return res.send(expenseItem);
});

router.put('/:id/:expenseId', [authMiddleware, adminMiddleware, validateObjectId, validateExpenseId], async (req, res) => {
    const { error } = validateExpenseItem(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const expense = expenseModel.getExpenseById(req.params.expenseId);
    if (expense === null) return res.status(404).send('The expense with the given id was not found');

    const expenseItem = await expenseItemModel.updateExpenseItem(req.params.id, req.params.expenseId, req.body);
    if (!expenseItem) return res.status(404).send('The expense item with the given id was not found');

    return res.send(expenseItem);
});

router.delete('/:id', [authMiddleware, adminMiddleware, validateObjectId], async (req, res) => {
    const expenseItem = await expenseItemModel.getExpenseItemById(req.params.id);
    if (!expenseItem) return res.status(404).send('The expenseItem with the given id was not found');

    await expenseItemModel.deleteExpenseItem(req.params.id);

    return res.send(expenseItem);
});

module.exports = router;
