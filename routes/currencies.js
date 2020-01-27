const validateObjectId = require('../middleware/validateObjectId');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { validateCurrency, currencyModel } = require('../models/currencies');
const express = require('express');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const currencies = await currencyModel.getCurrencies();
    res.send(currencies);
});

router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
    let currency = await currencyModel.getCurrencyByName(req.body.name);
    if (currency) return res.status(404).send('The currency already exist.');

    const { error } = validateCurrency(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    currency = await currencyModel.createCurrency(req.body);
    return res.send(currency);
});

router.get('/:id', [authMiddleware, validateObjectId], async (req, res) => {
    const currency = await currencyModel.getCurrencyById(req.params.id);
    if (!currency) return res.status(404).send('The currency with the given id was not found');
    return res.send(currency);
});

router.put('/:id', [authMiddleware, adminMiddleware, validateObjectId], async (req, res) => {
    const { error } = validateCurrency(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const currency = await currencyModel.updateCurrency(req.params.id, req.body);
    if (!currency) return res.status(404).send('The currency with the given id was not found');

    return res.send(currency);
});

router.delete('/:id', [authMiddleware, adminMiddleware, validateObjectId], async (req, res) => {
    const currency = await currencyModel.getCurrencyById(req.params.id);
    if (!currency) return res.status(404).send('The currency with the given id was not found');

    await currencyModel.deleteCurrency(req.params.id);
    return res.send(currency);
});

module.exports = router;
