const validateObjectId = require('../middleware/validateObjectId');
const authMiddleware = require('../middleware/auth');
const { validateCategory, categoryModel } = require('../models/categories');
const express = require('express');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const categories = await categoryModel.getCategories();
    res.send(categories);
});

router.post('/', authMiddleware, async (req, res) => {
    let category = await categoryModel.getCategoryByName(req.body.name);
    if (category) return res.status(404).send('The category already exist.');

    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    category = await categoryModel.createCategory(req.body);
    return res.send(category);
});

router.get('/:id', [authMiddleware, validateObjectId], async (req, res) => {
    const category = await categoryModel.getCategoryById(req.params.id);
    if (!category) return res.status(404).send('The category with the given id was not found');
    return res.send(category);
});

router.put('/:id', [authMiddleware, validateObjectId], async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await categoryModel.updateCategory(req.params.id, req.body);
    if (!category) return res.status(404).send('The category with the given id was not found');

    return res.send(category);
});

router.delete('/:id', [authMiddleware, validateObjectId], async (req, res) => {
    const category = await categoryModel.getCategoryById(req.params.id);
    if (!category) return res.status(404).send('The category with the given id was not found');

    await categoryModel.deleteCategory(req.params.id);
    return res.send(category);
});

module.exports = router;
