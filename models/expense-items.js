const Joi = require('joi');
const _ = require('lodash');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { categoryModel } = require('./categories');
const { expenseModel } = require('./expenses');

const expenseItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 255,
        unique: true,
        uniqueCaseInsensitive: true
    },
    estimatedPrice: {
        type: Number,
        default: 0,
    },
    realPrice: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number, required: true
    },
    status: {
        type: String,
        maxLength: 50,
        default: 'New'
    },
    isActive: {
        type: Boolean, default: true
    },
    category: categoryModel.categorySchema,
    expense: {
        name: { type: String },
        description: { type: String },
        user: mongoose.Schema({
            name: { type: String, maxLength: 100 },
            surname: { type: String, maxLength: 100 },
            email: { type: String },
        }),
        isActive: { type: Boolean, default: true }
    }
});

expenseItemSchema.plugin(uniqueValidator, {
    message: 'Error, expected {PATH} to be unique.'
});

const ExpenseItem = mongoose.model('ExpenseItem', expenseItemSchema);

const getExpenseItems = async () => {
    return await ExpenseItem.find().sort('name');
};

const getExpenseItemById = async (id) => {
    return await ExpenseItem.findById(id);
};

const createExpenseItem = async (expenseId, data) => {
    const expense = await expenseModel.getExpenseById(expenseId);

    let category = null;
    if (!_.isEmpty(data.category)) {
        category = await categoryModel.getCategoryByName(data.category.name);
        if (category === null) category = await categoryModel.createCategory(data.category);
    }

    const expenseItem = new ExpenseItem({
        name: data.name,
        estimatedPrice: data.estimatedPrice,
        realPrice: data.realPrice,
        quantity: data.quantity,
        status: data.status,
        isActive: data.isActive,
        category,
        expense
    });

    await expenseItem.save();

    return expenseItem;
};

const updateExpenseItem = async (id, expenseId, data) => {
    const expense = await expenseModel.getExpenseById(expenseId);
    let category = null;
    if (!_.isEmpty(data.category)) {
        category = await categoryModel.getCategoryByName(data.category.name);
        if (category === null) category = await categoryModel.createCategory(data.category);
    }

    return await ExpenseItem.findOneAndUpdate(
        id,
        {
            $set: {
                name: data.name,
                estimatedPrice: data.estimatedPrice,
                realPrice: data.realPrice,
                quantity: data.quantity,
                status: data.status,
                isActive: data.isActive,
                category,
                expense
            }
        },
        { new: true }
    );
};

const deleteExpenseItem = async (id) => {
    return await ExpenseItem.findByIdAndDelete(id);
};

function validateExpenseItem(expenseItem) {
    const schema = {
        name: Joi.string().max(255).required(),
        category: Joi.object(),
        status: Joi.string(),
        quantity: Joi.number().required(),
        expense: Joi.object(),
        estimatedPrice: Joi.number(),
        realPrice: Joi.number(),
        isActive: Joi.boolean(),
    };

    return Joi.validate(expenseItem, schema);
}

module.exports.ExpenseItem = ExpenseItem;
module.exports.validateExpenseItem = validateExpenseItem;
module.exports.expenseItemModel = {
    getExpenseItems,
    getExpenseItemById,
    createExpenseItem,
    updateExpenseItem,
    deleteExpenseItem,
    expenseItemSchema
};
