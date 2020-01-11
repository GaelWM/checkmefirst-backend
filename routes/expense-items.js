const validateObjectId = require('../middleware/validateObjectId');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const express = require('express');
const { validate, expenseItemModel } = require('../models/expense-items');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const expenseItems = await expenseItemModel.getexpenseItems();
    res.send(expenseItems);
});

router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const expenseItem = await expenseItemModel.createExpenseItem(req.body);
    return res.send(expenseItem);
});

router.get('/:id', [authMiddleware, validateObjectId], async (req, res) => {
    const expenseItem = await expenseItemModel.getExpenseItemById(req.params.id);
    if (!expenseItem) return res.status(404).send('The expenseItem with the given id was not found');
    return res.send(expenseItem);
});

router.put('/:id', [authMiddleware, adminMiddleware, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const expenseItem = await expenseItemModel.updatExpenseItem(req.params.id, req.body);
    if (!expenseItem) return res.status(404).send('The expenseItem with the given id was not found');

    return res.send(expenseItem);
});

router.delete('/:id', [authMiddleware, adminMiddleware, validateObjectId], async (req, res) => {
    const expenseItem = await expenseItemModel.getExpenseItemById(req.params.id);
    if (!expenseItem) return res.status(404).send('The expenseItem with the given id was not found');

    await expenseItemModel.deleteExpenseItem(req.params.id);

    return res.send(expenseItem);
});

module.exports = router;
